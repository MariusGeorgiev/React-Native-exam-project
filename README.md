# Furniture World Store App – React Native Exam Project

---

## 1. Project Overview
**Application Name:** Furniture World
**Application Category / Topic:** Shopping / Furniture / E-commerce  
**Main Purpose:**  
Furniture shop application.  

---

## 2. User Access & Permissions
**Guest (Not Authenticated)**  
- Browse Home/furniture list  
- View furniture details  
- Contact via contact form  

**Authenticated User** 
- All from Guest
- Add favorites 
- Remove favorites
- View profile data
- Edit profile data
- Add items to cart
- Remove items from cart
- Place an Orders
- View Orders

**Admin User**
- All from Guest and User
- Create furniture items  
- Edit furniture items  
- Delete furniture items  

---

## 3. Authentication & Session Handling
**Authentication Flow:**  
1. App checks authentication status on launch  
2. Unauthenticated users have access only to guest screens  
3. Authenticated users can access main features and admin options  
4. Logout clears session and returns to guest state  

**Session Persistence:**  
- User session stored  
- Automatic login after app restart  

---

## 4. Navigation Structure
**Root Navigation Logic:**  
- Split between authenticated and unauthenticated routes  

**Main Navigation:**  
- Tab-based navigation (Home, Categories, Favorites, Cart, Add/Create)
- Drawer navigation (Profile, Orders, Info & Contact) 

**Nested Navigation:**  
- Stack navigators inside tabs  
- Screens: Furniture List, Details, Edit, Checkout, Create
- Stack navigators inside drawer
- Screens: Orders List, Orders Details, Details furniture

---

## 5. List → Details Flow
**List / Overview Screen:**  
- Displays furniture items with image, title, and price  
- Tap an item to view details  

**Details Screen:**  
- Navigation  
- Displays images, dimensions, material, colors, description  

---

## 6. Data Source & Backend
**Backend Type:**  
- Firebase Firestore (real backend)  
- Images stored in Firebase Storage  

---

## 7. Data Operations (CRUD)
**Read (GET):**  
- Fetch furniture data for list and details screens  

**Create (POST):**  
- Admins can create furniture entries via Add/Create Furniture form  

**Update / Delete (Mutation):**  
- Admins can edit or delete existing furniture  
- Details screen refreshes after updates  

---

## 8. Forms & Validation
**Forms**  
- 

**Validation Rules:**  
- **Title:** 3–100 characters, required  
- **Price:** positive number, required  
- **Description:** 10–500 characters, required  
- **Material & Colors:** 3–50 characters  
- **Dimensions:** positive numbers
- Field name with multiple validation rules:

---

## 9. Native Device Features
**Used Native Feature(s):** 
- Camera / Image Picker
- Location 

**Usage Description:**  
- Take photo or select from gallery for furniture images
- Take photo or select from gallery for User profile picture
- Upload images to Firebase Storage 
- Use location for profile data
- Use location for checkout  

---

## 10. Typical User Flow
1. Launch app as guest  
2. Browse furniture list  
3. Tap an item → view details  
4. (Optional) Register / Log in → favorite / add to cart / place order 
5. Admin: create or edit furniture items  

---

## 11. Error & Edge Case Handling
- **Authentication errors:** show alert  
- **Network or data errors:** alert and fallback UI  
- **Empty or missing data:** placeholders or "No data" messages  
- **Form validation errors:** alert user with field-specific rules  

---

## 12. Getting Started
**Prerequisites:**  


**Installation:**  
