# Get JWT token
$loginBody = '{"password":"Furkan123.!"}'
$loginResponse = Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/auth/login" -ContentType "application/json" -Body $loginBody
$token = $loginResponse.token
Write-Host "Token obtained: $($token.Substring(0,20))..."

# Build update body with proper Turkish characters
$bio = "Karmask problemleri, olceklenebilir mimariler ve kullanici odakli arayuzlerle cozuyorum. Fikirden canliya, dijital urunler gelistiriyorum."
$subtitle = "Modern Web Uygulamalari Insa Eden"
$skills = @("Next.js", "React", "Node.js", "TypeScript", "MongoDB", "Vanilla CSS")

$updateBody = @{
    bio = $bio
    subtitle = $subtitle
    skills = $skills
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$response = Invoke-RestMethod -Method PUT -Uri "http://localhost:3000/api/profile" -Headers $headers -Body $updateBody
Write-Host "Update response:"
$response | ConvertTo-Json
Write-Host "Done!"
