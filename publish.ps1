cd app/frontend
ng build --prod --aot=false
cd ../..

electron-builder build --publish always
