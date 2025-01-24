# Automating CI/CD for a Node.js App with Docker and GitHub Actions: A Comprehensive Guide

![Blank diagram.png](Automating%20CI%20CD%20for%20a%20Node%20js%20App%20with%20Docker%20and%2018217c74f6d48065b38df2b00502e6bb/Blank_diagram.png)

In the modern software development landscape, automating your Continuous Integration and Continuous Deployment (CI/CD) pipeline is no longer optional—it's a necessity. Automation ensures that your code is always in a deployable state, reduces manual errors, and accelerates the release process. In this article, I’ll take you through a detailed walkthrough of how I set up a robust CI/CD pipeline for a simple Node.js application using **Docker** and **GitHub Actions**. Whether you're a beginner or an experienced developer, this guide will provide you with actionable insights to implement a similar pipeline in your projects.

## **Project Overview**

The project is a straightforward Node.js application with the following structure:

```notion
github/workflows
    docker-ci-cd.yml
node_modules
public
    index.html
    script.js
    style.css
test
    app.test.js
.gitignore
docker-compose.yml
Dockerfile
index.js
package-lock.json
package.json
readme.md
```

The application serves static files (HTML, CSS, and JavaScript) from the public directory and includes a basic Express server. It also has a test suite to ensure the application behaves as expected. The goal is to automate the testing, building, and deployment of this application using Docker and GitHub Actions.

## **Key Components of the Project**

Let’s break down the key components of the project and how they contribute to the CI/CD pipeline.

1. **Express Server (`index.js`)**
    
    The `index.js` file is the entry point of the application. It sets up an Express server that serves static files from the `public` directory and listens on port 3000.
    
    ```jsx
    const express = require('express');
    const path = require('path');
    
    const app = express();
    const PORT = 3000;
    
    // Serve static files from the "public" directory
    app.use(express.static(path.join(__dirname, 'public')));
    
    // Define a route for the root URL
    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
    ```
    
    **Key Points:**
    
    - The server serves static files like `index.html`, `style.css`, and `script.js` from the `public` directory.
    - The root route (`/`) returns the `index.html` file.
    - The server listens on port 3000, making it accessible at `http://localhost:3000`.
2. **Testing with Supertest (`app.test.js`)**
    
    Testing is a critical part of any CI/CD pipeline. The `app.test.js` file contains tests written using the `supertest` library to ensure the server behaves as expected.
    
    ```jsx
    const request = require('supertest');
    const express = require('express');
    const path = require('path');
    
    // Mock the server setup
    const app = express();
    app.use(express.static(path.join(__dirname, '../public')));
    
    // Define the tests
    describe('Simple Node.js App', () => {
      test('GET / should return the HTML page', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.headers['content-type']).toContain('text/html');
        expect(response.text).toContain('Hello, World!');
      });
    
      test('Static files should be served correctly', async () => {
        const response = await request(app).get('/style.css');
        expect(response.statusCode).toBe(200);
        expect(response.headers['content-type']).toContain('text/css');
      });
    });
    ```
    
    **Key Points:**
    
    - The first test checks if the root route (`/`) returns a 200 status code, serves HTML content, and contains the text "Hello, World!".
    - The second test ensures that static files (like `style.css`) are served correctly with the appropriate content type (`text/css`).
    - These tests are run automatically in the CI/CD pipeline to catch issues early.
3. **Dockerizing the Application (`Dockerfile`)**
    
    Docker allows us to containerize the application, ensuring consistency across different environments. The `Dockerfile` defines the steps to build a Docker image for the Node.js application.
    
    ```jsx
    # Use an official Node.js runtime as the base image
    FROM node:16-alpine
    
    # Set the working directory inside the container
    WORKDIR /app
    
    # Copy dependency files
    COPY package*.json ./
    
    # Install dependencies
    RUN npm install
    
    # Copy the rest of the application code
    COPY . .
    
    # Expose the application port
    EXPOSE 3000
    
    # Run the application
    CMD ["npm", "start"]
    ```
    
    **Key Points:**
    
    - The `node:16-alpine` image is used as the base image, which is lightweight and optimized for Node.js applications.
    - Dependencies are installed using `npm install` after copying `package.json` and `package-lock.json`.
    - The application code is copied into the container, and port 3000 is exposed.
    - The `CMD` instruction starts the application using `npm start`.
4. **CI/CD Pipeline with GitHub Actions (`docker-ci-cd.yml`)**
    
    The heart of the automation process is the GitHub Actions workflow defined in `docker-ci-cd.yml`. This file automates the testing, building, and deployment of the application.
    
    ```yaml
    name: CI/CD Pipeline
    
    on:
      push:
        branches:
          - master
          - staging
    
    jobs:
      test:
        runs-on: ubuntu-latest
    
        steps:
        - name: Checkout Code
          uses: actions/checkout@v3
    
        - name: Install Dependencies
          run: |
            npm install
    
        - name: Run Tests
          run: npm test
    
      build-and-push-docker-image:
        runs-on: ubuntu-latest
        needs: test
    
        steps:
        - name: Checkout Code
          uses: actions/checkout@v3
    
        - name: Set up Docker Buildx
          uses: docker/setup-buildx-action@v2
    
        - name: Log in to Docker Hub
          uses: docker/login-action@v2
          with:
            username: ${{ secrets.DOCKER_USERNAME }}
            password: ${{ secrets.DOCKER_PASSWORD }}
    
        - name: Build and Push Docker Image
          uses: docker/build-push-action@v5
          with:
            push: true
            tags: |
              ${{ secrets.DOCKER_USERNAME }}/nodejs-app:latest
              ${{ secrets.DOCKER_USERNAME }}/nodejs-app:${{ github.sha }}
    
      deploy:
        runs-on: ubuntu-latest
        needs: build-and-push-docker-image
    
        steps:
        - name: Add SSH Private Key
          uses: webfactory/ssh-agent@v0.7.0
          with:
            ssh-private-key: ${{ secrets.SSH_KEY }}
    
        - name: Deploy to Server
          run: |
            ssh -o StrictHostKeyChecking=no ubuntu@${{ secrets.SERVER_IP }} << 'EOF'
            echo "Connected to EC2 instance!"
            sudo docker stop nodejs-app || true
            sudo docker rm nodejs-app || true
            sudo docker container prune -f
            sudo docker images prune -f
            
            sudo docker pull ${{ secrets.DOCKER_USERNAME }}/nodejs-app:latest
            sudo docker run -d --name nodejs-app -p 3000:3000 --restart always ${{ secrets.DOCKER_USERNAME }}/nodejs-app:latest
            EOF
    
        - name: Set up Nginx for port forwarding 
          run: |
              sudo tee /etc/nginx/sites-available/default << EOL
              server {
                listen 80;
                server_name _;
      
                location / {
                  proxy_pass http://localhost:3000;
                  proxy_set_header Host \$host;
                  proxy_set_header X-Real-IP \$remote_addr;
                  proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
                  proxy_set_header X-Forwarded-Proto \$scheme;
                }
              }
              EOL
      
              # Restart Nginx to apply the changes
              sudo systemctl restart nginx
    
        - name: Notify on Success
          if: success()
          run: |
            echo "Deployment Successful!"
    
        - name: Notify on Failure
          if: failure()
          run: |
            echo "Deployment Failed!"
    ```
    
    **Key Points:**
    
    - The pipeline is triggered on pushes to the `master` and `staging` branches.
    - **Test Job**: Installs dependencies and runs tests using `npm test`.
    - **Build and Push Docker Image Job**: Builds the Docker image and pushes it to Docker Hub with two tags: `latest` and the commit SHA.
    - **Deploy Job**: Connects to a remote server via SSH, stops and removes any existing containers, pulls the latest Docker image, and runs it. It also sets up Nginx for port forwarding.
    - Notifications are sent based on the success or failure of the deployment.

## Benefits of This Setup

1. **Automated Testing**: Ensures that every change is tested before deployment, reducing the risk of bugs in production.
2. **Consistent Builds**: Docker ensures that the application runs the same way in all environments.
3. **Seamless Deployment**: GitHub Actions automates the entire deployment process, from testing to pushing Docker images and deploying to a server.
4. **Scalability**: This setup can be easily extended to include additional environments, such as production or staging.

## Conclusion

By setting up this CI/CD pipeline, I’ve automated the testing, building, and deployment processes for my Node.js application. This ensures that every push to the `master` or `staging` branches triggers a series of actions that validate the code, build a Docker image, and deploy it to a server. This setup not only saves time but also reduces the risk of human error, making the development process more efficient and reliable.

Feel free to adapt this setup to your own projects, and let me know if you have any questions or suggestions for improvement!