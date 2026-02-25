git add .
git commit -m "first commit"
git branch -M main
if (!(git remote | Select-String "origin")) {
    git remote add origin https://github.com/Elmala02/ChatDise-o.git
}
git push -u origin main