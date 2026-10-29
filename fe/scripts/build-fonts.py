"""Rebuild bundled fonts. Requires fonttools[woff]; not needed for next build."""
from io import BytesIO
from pathlib import Path
from urllib.request import urlopen

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

DESTINATION = Path(__file__).resolve().parents[1] / 'src/app/fonts'
UNICODES = 'U+0000-00FF,U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0303,U+0306,U+0308-0309,U+031B,U+0323,U+1EA0-1EF9,U+2000-206F,U+20AB-20AC,U+2122,U+2190-2193,U+2212,U+FEFF,U+FFFD'
SOURCES = {
    'inter': ('https://raw.githubusercontent.com/google/fonts/main/ofl/inter/Inter%5Bopsz,wght%5D.ttf', {'wght': (400, 700), 'opsz': 14}),
    'garamond': ('https://raw.githubusercontent.com/google/fonts/main/ofl/ebgaramond/EBGaramond%5Bwght%5D.ttf', {'wght': 400}),
}

for name, (url, axes) in SOURCES.items():
    with urlopen(url, timeout=30) as response:
        font = TTFont(BytesIO(response.read()))
    font = instantiateVariableFont(font, axes, inplace=True)
    # Reload to normalize lazy variation tables before subsetting.
    stream = BytesIO()
    font.save(stream)
    stream.seek(0)
    font = TTFont(stream)
    options = subset.Options()
    options.flavor = 'woff2'
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(unicodes=subset.parse_unicodes(UNICODES))
    subsetter.subset(font)
    font.flavor = 'woff2'
    font.save(DESTINATION / f'{name}-latin-vietnamese.woff2')
