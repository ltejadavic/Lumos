Lumos - Lessons App
This project is a full-stack web application designed for user registration and authentication. It utilizes NestJS for the backend and Next.js for the frontend, with TypeScript throughout. The app is set up with secure authentication processes, CORS handling, and structured entity relationships to allow role-based access and various functionalities.

Completed Features

	1.	Backend with NestJS
		Entity Models: Defined for User and Role, including the necessary relationships. The User entity includes various attributes like name, email, and nested location fields (district, province, city, country).
		Auth Module: Implemented auth.controller.ts and auth.service.ts for core authentication and authorization logic, including:
		JWT Token Generation and secure password hashing.
		Role retrieval for dynamic user assignment.
		API Routes: Configured routes under /api/auth prefix for user registration, login, and role fetching.
		Database Integration: Successfully connected to a PostgreSQL database with entities set up using TypeORM.
  
	2.	Frontend with Next.js
		User Registration Form: Created with dropdowns for country, province, city, and district populated dynamically through GeoNames API.
		Role-Based Dropdown: Fetches roles from the backend and displays them in a dropdown list.
		State Management: Managed using React hooks and structured API calls for roles and registration, with error handling.
  
 	3.	Advanced Authentication and Authorization:
		Enhanced JWT Token Structure: The token now includes user details such as nombre, apellidos, and role, enabling detailed user information to be decoded and used on the client side.
		Role-Based Logic Integration: Applied role-based checks in the auth.controller.ts to ensure the correct role is used during authentication. This supports protected routes and custom user experiences.
		Password Hashing and Validation: Implemented secure password hashing with bcrypt during user creation and comparison in login for enhanced security.
		Authorization Checks: Integrated logic to redirect users based on roles (e.g., only Administrador can access the registration view), adding an additional layer of access control.
  
	4.	Frontend with Next.js (Enhancements):
		Home View Personalization: The home page now greets the user by their full name (e.g., “Bienvenido, Luis Tejada!”) and displays their role, retrieved from the decoded JWT token.
		Conditional UI Rendering: Added conditional logic to show the “Ir a Registro” button only for users with the Administrador role.
		Improved Navigation and Token Handling:
		Redirects users to the /home page immediately after a successful login.
		Stored JWT token securely in localStorage, facilitating subsequent token-based authentications.
		User Experience Enhancements:
		Applied Bootstrap for consistent and responsive form design.
		Integrated local JSON data files for school and university suggestions to populate dropdowns and display filtered options based on user input.
  
	5.	Dynamic Data Handling:
		Local Data Integration for Registration:
		Implemented a local JSON-based system for schools and universities, which auto-suggests options in the registration form based on user input.
		APIs for Dynamic Forms: Used the GeoNames API to populate country, province, city, and district fields dynamically, ensuring that location-based data is seamlessly integrated into the user experience.
		State Management: Utilized React state hooks to handle form data, maintain dropdown states, and manage error/success messages.


Current Issues

	•	Consistency in Role-Based UI Rendering: Ensure that the role-based rendering logic consistently reflects the latest data structure from the backend.
	•	Token Expiry Handling: Implement automatic token renewal or prompt users to re-login when their token expires.

Pending Features

	•	Comprehensive Access Control: Expand role-based access to all protected routes and integrate a middleware check on both the client and server sides.
	•	Enhanced Form Validations: Add stricter client- and server-side validation for all input fields, focusing on data integrity and user experience.
	•	Testing and Docume
