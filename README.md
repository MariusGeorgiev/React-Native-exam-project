# Furniture World Store App 

# Release Build Download APK -
# Reserved Link

## 📱 Download APK Prerelease - need later to reupload

# [Download Furniture World App](https://github.com/MariusGeorgiev/React-Native-exam-project/releases/download/1.0/app-release.apk)

## To test full functionality of the app use some admin users down:
### Admin user: Email - admin@abv.bg / Password - asdasd
### Admin user secondary: Email - maro1@abv.bg / Password - asdasd
### Admin user third: Email - admin1@abv.bg / Password - 123456

---

## 1. Project Overview
**Application Name:**
- Furniture World

**Application Category / Topic:** 
- Shopping / Furniture / E-commerce  

**Main Purpose:**
- Furniture World is a mobile application that allows users to browse and purchase furniture easily from their phones. The app helps users discover furniture by categories, view detailed product information, and place orders quickly. It simplifies the shopping process and provide a convenient way to manage favorites. 

---

## 2. User Access & Permissions
**Guest (Not Authenticated)**  
- Browse Home/ Furniture List  
- View Furniture Details  
- Contact via contact form  

**User (Authenticated for)** 
- All from Guest
- Add Favorites 
- Remove Favorites
- View Profile data
- Edit Profile data
- Add items to cart
- Remove items from cart
- Place an Order
- View Orders

**Admin (Authenticated for)**
- All from User
- Create Furniture items  
- Edit Furniture items  
- Delete Furniture items  

---

## 3. Authentication & Session Handling
**Authentication Flow:**  
1. App checks authentication status on launch  
2. Unauthenticated users have access only to guest screens  
3. Authenticated users can access main features and admin options  
4. Logout clears session and returns to guest state  

**Session Persistence:**  
- The user session is managed by Firebase Authentication and stored locally on the device using AsyncStorage.

- When the application restarts, Firebase automatically restores the authentication state from AsyncStorage.

---

**4. Navigation Structure**

- Root Navigation Logic:

The application split navigation based on the user’s authentication state. When the app starts, it listens for authentication changes from Firebase. If a user is authenticated, they are redirected to the main part of the app. If no authenticated the app displays Guest screens & Login / Register.

- Main Navigation:

The main navigation is structured using a bottom tab navigator. It consists of several primary sections such as Home-(show 4 best category and 10 last items), Categories-(browse in all categories), Cart, and if user is Admin add/create screen.

- Secondary Navigation:

The application includes also a drawer navigation that provides access to additional sections beyond the main tabs. It is accessible from the header and allows users to quickly navigate to secondary navigation screens such as Profile, My Orders, Information & Contact.

- Nested Navigation:

Application uses nested navigation by combining stack navigators inside some tab's & drawer's. This allows for deeper navigation within each screen. For example, in the Home tab, users can navigate from product to screen details. Additional screens include edit/create furniture screens (for admins), Cart contain checkout screen, Orders contain list of orders and details for them. 

---

## 5. List → Details Flow

**List / Overview Screen:**

* Displays furniture items with image, title, and price
* Tap an item to view details

**Details Screen:**

* Navigation is triggered when the user taps on a furniture card, which calls the navigation function to open the details screen.
* The selected furniture item's data is passed through route parameters to the details screen, where it is used to display detailed information.

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
- Admins can create furniture via Add/Create Furniture form  

**Update / Delete (Mutation):**  
- Admins can edit or delete existing furniture  
- Details screen refreshes after updates  

---

## 8. Forms & Validation

- Forms Used:

The application includes several forms such as Login, Register, Edit Profile, Add/Create Furniture, Edit Furniture, and Checkout. These forms allow users to authenticate, manage their personal information, create or modify furniture items (admin), and complete orders.

- Validation Rules:

- - Login:
- - - **Email & Password:** Please enter email and password
- - - Please check your internet connection.

- - Register: 
- - - **Email:** The email is already occupied, Please enter a valid email address
- - - **Password:** Password cannot contain spaces, Password must be at least 6 characters, Passwords do not match
- - - Network error. Please check your internet connection.

- - Edit & Create:
- - - **Title:** 3–100 characters, required.
- - - **Image:** required.
- - - **Category:** required.
- - - **Subcategory:** required.
- - - **Price:** positive number, required, max length 5 digits, cnot contain "." or ",".
- - - **Description:** 10–500 characters, required.
- - - **Material & Colors:** 3–20 characters, required.
- - - **Dimensions:** Dimensions must be positive numbers, required, max length 4 digits, cnot contain "." or ",".
- - - **Description:** Description must be 10-500 characters, required.

- - Checkout:
- - - **Username:** Should be 3-40 characters, required.
- - - **Phone code:** It should start with '+' and 1-5 digits, required.
- - - **Phone number:** It should be 6-15 digits, required.
- - - **Street:** It should be 3-50 characters, required.
- - - **City:** It should be 2-50 characters, required.
- - - **Postal code:** It should be 2-10 characters, required.
- - - **Country:** It should be 2-50 characters, required.

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
- **Empty or missing data:** placeholders or "min length required" messages  
- **Form validation errors:** alert user with field-specific rules  

---

## 12. Screenshots - need to add later

### App is tested on physical devices with Android 16 on 6.8" screen and Android 11 on 6.2" screen view on smaller screens is not tested 

## 13. Installation & Setup

###  Clone the Repository

```bash
git clone https://github.com/MariusGeorgiev/React-Native-exam-project.git
cd furniture-world
```

---

### 2. Install Dependencies

Make sure you have Node.js installed, then run:

```bash
npm install
```

---

### 3. Start the Application (Expo)

```bash
npm start
```

* Scan the QR code using the **Expo Go app** on your phone

---

## 📱 Running the APK (Alternative)

If you don’t want to run the project with Expo:

1. Download the APK from the link above
2. Transfer it to your Android device
3. Open the file and install it (allow unknown sources if needed)

---

## 📦 Building the APK

To create a production release build:

```bash
npm run build:android:release
```

---

### 📍 Where to find the APK

  ```
  android/app/build/outputs/apk/release/app-release.apk
  ```

---

## 🛠 Requirements

* Node.js
* Expo CLI
* Android Studio (for emulator) or a physical Android device

---

## 🚀 Notes

* Ensure your device and development machine are on the same network when using Expo
* If something fails, try to clear cache:

```bash
npx expo start -c
```



 
