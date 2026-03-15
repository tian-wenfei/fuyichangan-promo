$rootPath = "c:\Users\Lenovo\Desktop\3.0"
$port = 8080

Write-Host "Starting HTTP Server on port $port..."
Write-Host "Root directory: $rootPath"
Write-Host "Access your website at: http://localhost:$port/new-promo.html"
Write-Host "Press Ctrl+C to stop the server"
Write-Host ""

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $filePath = $request.Url.LocalPath.TrimStart('/')
        if ($filePath -eq '' -or $filePath -eq '/') {
            $filePath = 'new-promo.html'
        }
        
        $fullPath = Join-Path $rootPath $filePath
        
        Write-Host "Request: $($request.Url.LocalPath) -> $filePath"
        
        if (Test-Path $fullPath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($fullPath)
            $response.ContentLength64 = $bytes.Length
            
            $extension = [System.IO.Path]::GetExtension($fullPath).ToLower()
            switch ($extension) {
                '.html' { $response.ContentType = 'text/html; charset=utf-8' }
                '.css' { $response.ContentType = 'text/css' }
                '.js' { $response.ContentType = 'application/javascript' }
                '.png' { $response.ContentType = 'image/png' }
                '.jpg' { $response.ContentType = 'image/jpeg' }
                '.jpeg' { $response.ContentType = 'image/jpeg' }
                '.gif' { $response.ContentType = 'image/gif' }
                '.svg' { $response.ContentType = 'image/svg+xml' }
                default { $response.ContentType = 'application/octet-stream' }
            }
            
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            Write-Host "  -> OK ($($bytes.Length) bytes)"
        } else {
            $response.StatusCode = 404
            $errorText = "File not found: $filePath"
            $errorBytes = [System.Text.Encoding]::UTF8.GetBytes($errorText)
            $response.ContentLength64 = $errorBytes.Length
            $response.OutputStream.Write($errorBytes, 0, $errorBytes.Length)
            Write-Host "  -> 404 Not Found"
        }
        
        $response.Close()
    }
} finally {
    $listener.Stop()
    Write-Host "Server stopped."
}
