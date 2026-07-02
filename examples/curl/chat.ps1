$body = @{
  messages = @(
    @{
      role = "user"
      content = "Hello from TokenPilot"
    }
  )
} | ConvertTo-Json -Depth 4

Invoke-RestMethod -Uri "http://localhost:3001/chat" -Method Post -ContentType "application/json" -Body $body

