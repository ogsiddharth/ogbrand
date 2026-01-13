import { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, doc, setDoc, getDoc } from "./firebase-config.js";
// --- GLOBAL ELEMENTS ---
const signinModal = document.getElementById("signin-modal");
const signupModal = document.getElementById("signup-modal");
const userProfile = document.getElementById("user-profile");
const signinBtn = document.getElementById("signin-btn");
const userNameSpan = document.getElementById("user-name");

// --- 1. HANDLE SIGNUP (Real Cloud Create) ---
const rForm = document.getElementById("signup-form");
if (rForm) {
    rForm.onsubmit = async (e) => {
        e.preventDefault();
        const name = document.getElementById("signup-name").value;
        const email = document.getElementById("signup-email").value;
        const password = document.getElementById("signup-password").value;

        try {
            // Firebase Server par user banao
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // User ka extra data (Name) Database me save karo
            await setDoc(doc(db, "users", user.uid), {
                fullName: name,
                email: email,
                cart: [], // Empty cart start me
                orders: []
            });

            alert("Account Created Successfully!");
            if(signupModal) signupModal.classList.remove("open");
            
        } catch (error) {
            // Agar email already exist karta hai ya password weak hai
            alert("Error: " + error.message);
        }
    };
}

// --- 2. HANDLE LOGIN (Real Security Check) ---
const sForm = document.getElementById("signin-form");
if (sForm) {
    sForm.onsubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById("signin-email").value;
        const password = document.getElementById("signin-password").value;

        try {
            // Ye line server se check karegi. Agar password galat hua to sidha CATCH me jayega.
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            
            alert("Login Success!");
            if(signinModal) signinModal.classList.remove("open");
            
        } catch (error) {
            // YAHAN HAI REAL SECURITY. Galat password par ye chalega.
            alert("WRONG EMAIL OR PASSWORD! Please try again.");
            console.error(error);
        }
    };
}

// --- 3. HANDLE LOGOUT ---
window.logout = async function() { // Window me attach kiya kyuki module scope alag hota hai
    try {
        await signOut(auth);
        alert("Logged Out");
        window.location.href = "index.html";
    } catch (error) {
        console.error(error);
    }
}

// --- 4. CHECK LOGIN STATE (Auto Check by Google) ---
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // User Login Hai
        console.log("User Logged In:", user.email);
        
        // Database se naam uthao
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const userData = docSnap.data();
            if(userNameSpan) userNameSpan.textContent = userData.fullName.split(" ")[0]; // First Name
        }

        // UI Updates
        if(signinBtn) signinBtn.style.display = 'none';
        if(userProfile) userProfile.style.display = 'flex';

    } else {
        // User Logout Hai
        console.log("No User");
        if(signinBtn) signinBtn.style.display = 'block';
        if(userProfile) userProfile.style.display = 'none';
    }
});