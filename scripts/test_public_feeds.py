import importlib.util
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location("feeds", Path(__file__).with_name("refresh-public-feeds.py"))
feeds = importlib.util.module_from_spec(spec)
spec.loader.exec_module(feeds)

RSS = b'<rss version="2.0"><channel><item><title>Test</title><link>https://example.com/docs/c/p</link><guid>urn:example.com:post:1</guid><description>Example</description></item></channel></rss>'
SITEMAP = b'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://example.com/docs/c/p</loc></url></urlset>'
API = b'{"data":[{"id":1,"status":"PUBLISHED","publishedAt":null}],"meta":{"lastPage":1}}'

class FeedJobTest(unittest.TestCase):
    def test_validates_then_saves_both_snapshots(self):
        with tempfile.TemporaryDirectory() as directory, patch.object(feeds, 'fetch', side_effect=[RSS, SITEMAP, API]):
            target = Path(directory)
            self.assertEqual(feeds.refresh('https://example.com', 'https://api.example.com', target), (1, 1))
            self.assertEqual((target / 'rss.xml').read_bytes(), RSS)
            self.assertEqual((target / 'sitemap.xml').read_bytes(), SITEMAP)

    def test_failure_keeps_existing_snapshot(self):
        with tempfile.TemporaryDirectory() as directory, patch.object(feeds, 'fetch', side_effect=[RSS, SITEMAP, API.replace(b'"id":1', b'"id":2')]):
            target = Path(directory)
            (target / 'rss.xml').write_bytes(b'previous')
            with self.assertRaisesRegex(ValueError, 'RSS/API mismatch'):
                feeds.refresh('https://example.com', 'https://api.example.com', target)
            self.assertEqual((target / 'rss.xml').read_bytes(), b'previous')

if __name__ == '__main__':
    unittest.main()
