# Node.js CI/CD Pipeline with Docker and GitHub Actions

This project demonstrates how to set up a **CI/CD pipeline** for a Node.js application using **Docker** and **GitHub Actions**. The pipeline automates testing, building, and deploying the application to a remote server, ensuring a seamless and reliable deployment process.

---

## 📁 Project Structure

```
.github/workflows/
    docker-ci-cd.yml
node_modules/
public/
    index.html
    script.js
    style.css
test/
    app.test.js
.gitignore
docker-compose.yml
Dockerfile
index.js
package-lock.json
package.json
README.md
```

---

## 🚀 Features

- **Express Server**: Serves static files and handles routes.
- **Automated Testing**: Uses `supertest` to validate server behavior.
- **Dockerized Builds**: Ensures consistent builds across environments.
- **CI/CD Pipeline**: Automates testing, building, and deployment using GitHub Actions.
- **Nginx Reverse Proxy**: Configures Nginx to forward requests to the Node.js app.

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **Docker** (for containerization)
- **GitHub Account** (for GitHub Actions)
- **Docker Hub Account** (for storing Docker images)
- **Remote Server** (e.g., EC2 instance) with Docker and Nginx installed

---

## 🚀 Getting Started

### 1. Clone the Repository

```
git clone https://github.com/your-username/nodejs-ci-cd-docker.git
cd nodejs-ci-cd-docker
```

### 2. Install Dependencies

```
npm install
```

### 3. Run the Application Locally

```
npm start
```

Visit `http://localhost:3000` in your browser to see the application running.

---

## 🐳 Docker Setup

### Build the Docker Image

```
docker build -t your-dockerhub-username/nodejs-app .
```

### Run the Docker Container

```
docker run -d -p 3000:3000 --name nodejs-app your-dockerhub-username/nodejs-app
```

Visit `http://localhost:3000` to see the app running in a Docker container.

---

## 🛠️ CI/CD Pipeline with GitHub Actions

The CI/CD pipeline is defined in `.github/workflows/docker-ci-cd.yml`. It performs the following steps:

1. **Test**: Runs automated tests using `npm test`.
2. **Build and Push Docker Image**: Builds the Docker image and pushes it to Docker Hub.
3. **Deploy**: Deploys the application to a remote server using SSH.

### Secrets Required

To run the pipeline, you need to set the following secrets in your GitHub repository:

- `DOCKER_USERNAME`: Your Docker Hub username.
- `DOCKER_PASSWORD`: Your Docker Hub password.
- `SSH_KEY`: Private SSH key for accessing the remote server.
- `SERVER_IP`: IP address of the remote server.

---

## 🧪 Running Tests

To run the tests locally:

```
npm test
```

The tests ensure that:

- The root route (`/`) returns the correct HTML page.
- Static files (e.g., `style.css`) are served correctly.

---

## 🌐 Deployment

The application is deployed to a remote server using the following steps:

1. **Pull the Latest Docker Image**:
    
    ```
    docker pull your-dockerhub-username/nodejs-app:latest
    ```
    
2. **Run the Docker Container**:
    
    ```
    docker run -d -p 3000:3000 --name nodejs-app --restart always your-dockerhub-username/nodejs-app:latest
    ```
    
3. **Configure Nginx**:
    - Update the Nginx configuration to forward requests from port 80 to port 3000.
    - Restart Nginx to apply the changes:
        
        ```
        sudo systemctl restart nginx
        ```
        

---

## 📂 File Descriptions

- **`index.js`**: Entry point for the Express server.
- **`Dockerfile`**: Defines the Docker image for the application.
- **`docker-ci-cd.yml`**: GitHub Actions workflow for CI/CD.
- **`app.test.js`**: Automated tests for the application.
- **`public/`**: Contains static files (HTML, CSS, JS).
- **`package.json`**: Defines project dependencies and scripts.

---

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

---

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/) for the web framework.
- [Docker](https://www.docker.com/) for containerization.
- [GitHub Actions](https://github.com/features/actions) for CI/CD automation.
- [Supertest](https://github.com/visionmedia/supertest) for testing.

---

## 📧 Contact

If you have any questions or suggestions, feel free to reach out:

- **Email**: kabmmadusith2003@gmail.com
- **LinkedIn**: [www.linkedin.com/in/muditha-madusith](http://www.linkedin.com/in/muditha-madusith)

---

Happy coding! 🚀