This repository was merged from two repositories. 

The original repository was created by Tozawa-san: https://github.com/tozawahiroya/Tech0_Step4_POS_FastAPI,
and the other repository was created by Kurosu-san: https://github.com/tozawahiroya/Tech0_Step4_POS_Nextjs_ts.

This is a FastAPI-Next.js(TSX) repo

### git clone https://github.com/fumifumi9999/PosLv2.git

■ backend
- cd backend
- python3 -m venv backend_venv
- ./backend_env/Script/activate.ps1 (powershellの場合)
- pip install -r requirements.txt
- uvicorn main:app --reload

■ frontend
- cd frontend
- npm install
- (npm audit fix --force) ※when your terminal shows moderate severity vulnerabilities
- npm run dev



■ http://localhost:3000/ にアクセス