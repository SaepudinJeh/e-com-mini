# Project Title

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
  - [Backend](#backend)
    - [Development](#development)
    - [Production](#production)
  - [Frontend](#frontend)
    - [Development](#development-1)
    - [Production](#production-1)
  - [Postman Documentation](#postman-documentation)
- [Contributing](#contributing)
- [License](#license)

## Introduction
Provide a brief description of your project here.

## Features
- [x] User Authentication
- [x] Product Management
- [x] Cart Management
- [x] Payment Processing (Midtrans)
- [x] Order Management
- [x] Responsive Design

## Getting Started

```env
DATABASE_URL="your_database_url_here"
PORT=your_port_number_here
JWT_SECRET=your_jwt_secret_here
MIDTRANS_SERVER_KEY=your_midtrans_server_key_here
MIDTRANS_CLIENT_KEY=your_midtrans_client_key_here
BASE_URL_FRONTEND="your_frontend_base_url_here"
MIDTRANS_APP_URL=your_midtrans_app_url_here
```

### Backend

#### Development
To run the backend in development mode, use the following commands:
1. Navigate to the backend directory:
    ```bash
    cd /be/
    ```
2. Install dependencies:
    ```bash
    yarn
    ```
3. Start the development server:
    ```bash
    yarn dev
    ```

#### Production
To run the backend in production mode, use the following commands:
1. Build the project:
    ```bash
    yarn build
    ```
2. Start the production server:
    ```bash
    yarn start
    ```

### Frontend

#### Development
To run the frontend in development mode, use the following commands:
1. Navigate to the frontend directory:
    ```bash
    cd /fe/
    ```
2. Install dependencies:
    ```bash
    yarn
    ```
3. Start the development server:
    ```bash
    yarn dev
    ```

#### Production
To build the frontend for production, use the following command:
1. Build the project:
    ```bash
    yarn build
    ```

### Postman Documentation
To use the Postman documentation, import the files located in the `docs` folder into Postman:
1. Open Postman.
2. Go to the `Import` section.
3. Select the files located in the `docs` folder.

## Contributing
Explain how other users can contribute to the project.

## License
Include licensing information here.
