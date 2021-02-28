# Project2-ash47

# Flask and create-react-app


### Requirements
Run following commands in your terminal:
1.  ```bash
    npm install
    ``` 
2. ```bash
    pip install -r requirements.txt
    ```
alternate

2. ```bash
    sudo pip install -r requirements.txt
    ```
### Setup
1. Run the following code in the project direcotry 
```bash
echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local
```

## Run Application
1. Run command in terminal (in your project directory): `python app.py`
2. Run command in another terminal, `cd` into the project directory, and run `npm run start`
3. Preview web page in browser '/'

### Deploy to Heroku
1. Create a Heroku app: 
```bash
heroku create --buildpack heroku/python
```
2. Add nodejs buildpack: 
```bash
heroku buildpacks:add --index 1 heroku/nodejs
```
3. Push to Heroku: 
```bash
git push heroku main
```

<details>
  <summary>Incase </summary>
  
  
</details>

