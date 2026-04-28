package handlers

import (
	"image"
	_ "image/gif"
	_ "image/jpeg"
	_ "image/png"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"

	"meditour/cdn/config"
	"meditour/cdn/utils"

	"github.com/gin-gonic/gin"
)

type MediaItem struct {
	Name         string `json:"name"`
	OriginalName string `json:"original_name"`
	FileName     string `json:"file_name"`
	Path         string `json:"path"`
	Url          string `json:"url"`
	OptimizedUrl string `json:"optimized_url"`
	Size         int64  `json:"size"`
	MimeType     string `json:"mime_type"`
	UpdatedAt    int64  `json:"updated_at"`
	Width        int    `json:"width,omitempty"`
	Height       int    `json:"height,omitempty"`
	Variants     gin.H  `json:"variants,omitempty"`
}

type FolderItem struct {
	Name string `json:"name"`
	Path string `json:"path"`
}

func ListMediaHandler(c *gin.Context) {
	folder := c.Query("folder")
	sortBy := c.DefaultQuery("sort", "updated_at")
	direction := c.DefaultQuery("direction", "desc")
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "0"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))
	if limit < 0 {
		limit = 0
	}
	if offset < 0 {
		offset = 0
	}

	cleanPath, err := sanitizeRelativePath(folder, true)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid folder path"})
		return
	}

	fullPath, err := resolvePathWithinRoot(config.AppConfig.UploadDir, cleanPath)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid folder path"})
		return
	}

	// Ensure the directory exists
	if _, err := os.Stat(fullPath); os.IsNotExist(err) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Media listed successfully",
			"data": gin.H{
				"folders":     []FolderItem{},
				"files":       []MediaItem{},
				"total":       0,
				"limit":       limit,
				"offset":      offset,
				"has_more":    false,
				"next_offset": offset,
			},
		})
		return
	}

	entries, err := os.ReadDir(fullPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read directory: " + err.Error()})
		return
	}

	var folders []FolderItem
	var files []MediaItem

	for _, entry := range entries {
		info, err := entry.Info()
		if err != nil {
			continue
		}

		relPath := filepath.ToSlash(filepath.Join(cleanPath, entry.Name()))

		if entry.IsDir() {
			folders = append(folders, FolderItem{
				Name: entry.Name(),
				Path: relPath,
			})
		} else {
			if strings.HasPrefix(entry.Name(), ".") {
				continue
			}

			// We don't open every file for listing performance, just use extensions for basic mime
			mimeType := "application/octet-stream"
			ext := strings.ToLower(filepath.Ext(entry.Name()))
			switch ext {
			case ".jpg", ".jpeg":
				mimeType = "image/jpeg"
			case ".png":
				mimeType = "image/png"
			case ".gif":
				mimeType = "image/gif"
			case ".webp":
				mimeType = "image/webp"
			case ".svg":
				mimeType = "image/svg+xml"
			case ".mp4":
				mimeType = "video/mp4"
			case ".pdf":
				mimeType = "application/pdf"
			}

			files = append(files, MediaItem{
				Name:         entry.Name(),
				OriginalName: entry.Name(),
				FileName:     entry.Name(),
				Path:         relPath,
				Url:          utils.GetPathUrl(relPath),
				OptimizedUrl: utils.GetPathUrl(relPath),
				Size:         info.Size(),
				MimeType:     mimeType,
				UpdatedAt:    info.ModTime().Unix(),
			})
		}
	}

	// Sorting files
	sort.Slice(files, func(i, j int) bool {
		var compare bool
		switch sortBy {
		case "name":
			compare = files[i].Name < files[j].Name
		case "size":
			compare = files[i].Size < files[j].Size
		default: // updated_at
			compare = files[i].UpdatedAt < files[j].UpdatedAt
		}

		if direction == "desc" {
			return !compare
		}
		return compare
	})

	total := len(files)
	pagedFiles := files
	if limit > 0 {
		start := offset
		if start > total {
			start = total
		}
		end := start + limit
		if end > total {
			end = total
		}
		pagedFiles = files[start:end]
	}

	nextOffset := offset + len(pagedFiles)
	hasMore := limit > 0 && nextOffset < total

	c.JSON(http.StatusOK, gin.H{
		"message": "Media listed successfully",
		"data": gin.H{
			"folders":     folders,
			"files":       pagedFiles,
			"total":       total,
			"limit":       limit,
			"offset":      offset,
			"has_more":    hasMore,
			"next_offset": nextOffset,
		},
	})
}

func GetMediaDetailHandler(c *gin.Context) {
	path := c.Query("path")
	if path == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Path is required"})
		return
	}

	cleanPath, err := sanitizeRelativePath(path, false)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file path"})
		return
	}

	fullPath, err := resolvePathWithinRoot(config.AppConfig.UploadDir, cleanPath)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file path"})
		return
	}

	info, err := os.Stat(fullPath)
	if err != nil {
		if os.IsNotExist(err) {
			c.JSON(http.StatusNotFound, gin.H{"error": "File not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to access file: " + err.Error()})
		return
	}

	if info.IsDir() {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Path is a directory"})
		return
	}

	file, err := os.Open(fullPath)
	var mimeType string
	var width, height int
	if err == nil {
		mimeType, _ = utils.DetectMimeType(file, cleanPath)
		file.Seek(0, 0)
		if strings.HasPrefix(mimeType, "image/") {
			imgConfig, _, _ := image.DecodeConfig(file)
			width = imgConfig.Width
			height = imgConfig.Height
		}
		file.Close()
	}

	optimizedUrl := utils.GetPathUrl(cleanPath)
	variants := gin.H{
		"original": optimizedUrl,
	}

	if strings.HasPrefix(mimeType, "image/") {
		optimizedUrl += "?fmt=webp"
		variants["thumbnail"] = utils.GetPathUrl(cleanPath) + "?w=160&h=120&fmt=webp"
		variants["medium"] = utils.GetPathUrl(cleanPath) + "?w=800&fmt=webp"
		variants["large"] = utils.GetPathUrl(cleanPath) + "?w=1200&fmt=webp"
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Media retrieved successfully",
		"data": MediaItem{
			Name:         info.Name(),
			OriginalName: info.Name(),
			FileName:     info.Name(),
			Path:         cleanPath,
			Url:          utils.GetPathUrl(cleanPath),
			OptimizedUrl: optimizedUrl,
			Size:         info.Size(),
			MimeType:     mimeType,
			UpdatedAt:    info.ModTime().Unix(),
			Width:        width,
			Height:       height,
			Variants:     variants,
		},
	})
}
