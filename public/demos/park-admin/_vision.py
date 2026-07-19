import json, base64, os, sys
import urllib.request

# Read API key from mmx config
mmx_config_path = os.path.expanduser(r"~\.mmx\config.json")
with open(mmx_config_path) as f:
    mmx_config = json.load(f)
API_KEY = mmx_config["api_key"]
API_URL = "https://api.minimaxi.com/anthropic/v1/messages"

img_path = sys.argv[1] if len(sys.argv) > 1 else "02.png"
prompt = sys.argv[2] if len(sys.argv) > 2 else "描述这张图片"

with open(img_path, "rb") as f:
    img_b64 = base64.b64encode(f.read()).decode()

ext = os.path.splitext(img_path)[1].lower()
mime = {".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif"}.get(ext, "image/png")

body = {
    "model": "claude-sonnet-4-20250514",
    "max_tokens": 4096,
    "messages": [{
        "role": "user",
        "content": [
            {"type": "image", "source": {"type": "base64", "media_type": mime, "data": img_b64}},
            {"type": "text", "text": prompt}
        ]
    }]
}

req = urllib.request.Request(API_URL, data=json.dumps(body).encode(), headers={
    "Content-Type": "application/json",
    "x-api-key": API_KEY,
    "anthropic-version": "2023-06-01"
})

try:
    resp = urllib.request.urlopen(req, timeout=60)
    data = json.loads(resp.read())
    for c in data.get("content", []):
        if c.get("type") == "text":
            print(c["text"])
except urllib.error.HTTPError as e:
    body = e.read().decode()
    print(f"HTTP {e.code}: {body[:800]}")
except Exception as e:
    print(f"Error: {e}")
