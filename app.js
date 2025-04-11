// Define the AngularJS application
var app=angular.module('healthTracker', [])
// .controller('AuthController', ['$scope', '$http', '$window', function($scope, $http, $window) {
//     // Initialize login and signup data
//     $scope.loginData = {};
//     $scope.signupData = {};

//     // Email validation helper
//     function isValidEmail(email) {
//         const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         return re.test(email);
//     }

//     // Login Function
//     $scope.login = function(event) {
//         event.preventDefault();

//         const { email, password } = $scope.loginData;
//         if (!email || !password) {
//             alert("Please fill in all fields.");
//             return;
//         }
//         if (!isValidEmail(email)) {
//             alert("Please enter a valid email.");
//             return;
//         }
//         if (password.length < 6) {
//             alert("Password must be at least 6 characters.");
//             return;
//         }

//         $http.post('https://nutri-backend-mocha.vercel.app/api/auth/login', $scope.loginData, { 
//             withCredentials: true 
//         }).then(function(response) {
//             console.log(response.data);
//             // Store user data in local storage or session storage if needed
//             localStorage.setItem('userId', JSON.stringify(response.data.user.id));
//             alert(response.data.message);
//             $window.location.href = "dashboard.html";
//         }).catch(function(error) {
//             alert(error.data.message || "Invalid email or password");
//         });
//     };

//     // Signup Function
//     $scope.signup = function(event) {
//         event.preventDefault();

//         const { username, email, password } = $scope.signupData;
//         if (!username || !email || !password) {
//             alert("Please fill in all fields.");
//             return;
//         }
//         if (!isValidEmail(email)) {
//             alert("Please enter a valid email.");
//             return;
//         }
//         if (password.length < 6) {
//             alert("Password must be at least 6 characters.");
//             return;
//         }

//         $http.post('https://nutri-backend-mocha.vercel.app/api/auth/signup', $scope.signupData, { 
//             withCredentials: true 
//         }).then(function(response) {
//             localStorage.setItem('userId', JSON.stringify(response.data.user.id));
//             alert("Signup successful! Please log in.");
//             $window.location.href = "login.html";
//         }).catch(function(error) {
//             alert(error.data.message || "Signup failed");
//         });
//     };
// }])
//angular.module('healthTracker', [])
// app.controller('AuthController', ['$scope', '$http', '$window', function($scope, $http, $window) {
//     // Initialize login and signup data
//     $scope.loginData = {};
//     $scope.signupData = {};

//     // Login Function
//     $scope.login = function(event) {
//         event.preventDefault();

//         // Apply jQuery validation on the login form
//         const loginForm = $('#loginForm');
//         loginForm.validate({
//             rules: {
//                 email: {
//                     required: true,
//                     email: true
//                 },
//                 password: {
//                     required: true,
//                     minlength: 6
//                 }
//             },
//             messages: {
//                 email: {
//                     required: "Please enter your email.",
//                     email: "Please enter a valid email address."
//                 },
//                 password: {
//                     required: "Please enter your password.",
//                     minlength: "Password must be at least 6 characters."
//                 }
//             },
//             submitHandler: function() {
//                 // If form is valid, proceed with login
//                 $http.post('https://nutri-backend-mocha.vercel.app/api/auth/login', $scope.loginData, { 
//                     withCredentials: true 
//                 }).then(function(response) {
//                     console.log(response.data);
//                     localStorage.setItem('userId', JSON.stringify(response.data.user.id));
//                     alert(response.data.message);
//                     $window.location.href = "dashboard.html";
//                 }).catch(function(error) {
//                     alert(error.data.message || "Invalid email or password");
//                 });
//             }
//         });
//     };

//     // Signup Function
//     $scope.signup = function(event) {
//         event.preventDefault();

//         // Apply jQuery validation on the signup form
//         const signupForm = $('#signupForm');
//         signupForm.validate({
//             rules: {
//                 username: {
//                     required: true,
//                     minlength: 3
//                 },
//                 email: {
//                     required: true,
//                     email: true
//                 },
//                 password: {
//                     required: true,
//                     minlength: 6
//                 }
//             },
//             messages: {
//                 username: {
//                     required: "Please enter your username.",
//                     minlength: "Username must be at least 3 characters."
//                 },
//                 email: {
//                     required: "Please enter your email.",
//                     email: "Please enter a valid email address."
//                 },
//                 password: {
//                     required: "Please enter your password.",
//                     minlength: "Password must be at least 6 characters."
//                 }
//             },
//             submitHandler: function() {
//                 // If form is valid, proceed with signup
//                 $http.post('https://nutri-backend-mocha.vercel.app/api/auth/signup', $scope.signupData, { 
//                     withCredentials: true 
//                 }).then(function(response) {
//                     localStorage.setItem('userId', JSON.stringify(response.data.user.id));
//                     alert("Signup successful! Please log in.");
//                     $window.location.href = "login.html";
//                 }).catch(function(error) {
//                     alert(error.data.message || "Signup failed");
//                 });
//             }
//         });
//     };
// }]);
app.controller('AuthController', ['$scope', '$http', '$window', function($scope, $http, $window) {
    // Initialize login and signup data
    $scope.loginData = {};
    $scope.signupData = {};

    // Initialize validation for login form
    $(document).ready(function() {
        $('#loginForm').validate({
            rules: {
                email: { required: true, email: true },
                password: { required: true, minlength: 6 }
            },
            messages: {
                email: {
                    required: "Please enter your email.",
                    email: "Please enter a valid email address."
                },
                password: {
                    required: "Please enter your password.",
                    minlength: "Password must be at least 6 characters."
                }
            },
            submitHandler: function(form) {
                const scope = angular.element(form).scope();
                scope.$apply(function() {
                    scope.login(event);
                });
            }
        });

        // Initialize validation for signup form
        $('#signupForm').validate({
            rules: {
                username: { required: true, minlength: 3 },
                email: { required: true, email: true },
                password: { required: true, minlength: 6 }
            },
            messages: {
                username: {
                    required: "Please enter your username.",
                    minlength: "Username must be at least 3 characters."
                },
                email: {
                    required: "Please enter your email.",
                    email: "Please enter a valid email address."
                },
                password: {
                    required: "Please enter your password.",
                    minlength: "Password must be at least 6 characters."
                }
            },
            submitHandler: function(form) {
                const scope = angular.element(form).scope();
                scope.$apply(function() {
                    scope.signup(event);
                });
            }
        });
    });

    // Login Function
    $scope.login = function(event) {
        event.preventDefault();
        console.log("Login data:", $scope.loginData);

        $http.post('https://nutri-backend-mocha.vercel.app/api/auth/login', $scope.loginData, { withCredentials: true })
            .then(function(response) {
                console.log("Login successful:", response.data);
                localStorage.setItem('userId', JSON.stringify(response.data.user.id));
                $window.location.href = "dashboard.html";
            })
            .catch(function(error) {
                console.error("Login error:", error);
                alert(error.data?.message || "Invalid credentials");
            });
    };

    // Signup Function
    $scope.signup = function(event) {
        event.preventDefault();
        console.log("Signup data:", $scope.signupData);

        $http.post('https://nutri-backend-mocha.vercel.app/api/auth/signup', $scope.signupData, { withCredentials: true })
            .then(function(response) {
                console.log("Signup successful:", response.data);
                localStorage.setItem('userId', JSON.stringify(response.data.user.id));
                alert("Signup successful! Please log in.");
                $window.location.href = "login.html";
            })
            .catch(function(error) {
                console.error("Signup error:", error);
                alert(error.data?.message || "Signup failed");
            });
    };
}]);

app.controller('DashboardCtrl', ['$scope', '$http', '$window', function($scope, $http, $window) {
    // Verify authentication on page load
    $http.get('https://nutri-backend-mocha.vercel.app/dashboard', { 
        withCredentials: true 
    }).then(function(response) {
        $scope.message = response.data.message;
    }).catch(function(error) {
        const errorMessage = error.data?.message || "Unauthorized access";
        alert(errorMessage);
        $window.location.href = "login.html";
    });
    // Initialize user profile data
    $scope.profile = {
        age: 30,
        gender: 'male',
        weight: 70,
        height: 175,
        goal: 'maintain'
    };
    
    $scope.showProfileForm = false;
    
    // Initialize metrics
    $scope.calorieGoal = 2000;
    $scope.waterGoal = 2500;
    $scope.currentCalories = 1200;
    $scope.currentWater = 1500;
    $scope.streak = 7;
    
    // Mock appointments data
    $scope.appointments = [
        {
            doctor: "Dr. Sarah Johnson",
            date: "April 10, 2025",
            time: "2:30 PM",
            purpose: "Nutrition Consultation"
        },
        {
            doctor: "Dr. Michael Rodriguez",
            date: "April 15, 2025",
            time: "10:00 AM",
            purpose: "Fitness Assessment"
        }
    ];
    
    // Save profile changes
    $scope.saveProfile = function() {
        // Calculate goals based on profile data
        calculateGoals();
        
        // Show success message
        alert("Profile updated successfully!");
        
        // Hide form
        $scope.showProfileForm = false;
        
        // Send data to backend
        const userId = JSON.parse(localStorage.getItem('userId'));
        if (!userId) {
            alert("User not logged in. Redirecting to login page.");
            $window.location.href = "login.html";
            return;
        }
        const profileData = { ...$scope.profile, userId: userId };
        $http.post('https://nutri-backend-mocha.vercel.app/api/user/profile', profileData)
            .then(function(response) {
            console.log("Profile saved successfully", response.data);
            })
            .catch(function(error) {
            console.error("Error saving profile", error);
            });
    };
    
    // Calculate calorie and water goals based on profile
    function calculateGoals() {
        
        
        // Basic BMR calculation (Mifflin-St Jeor equation)
        let bmr = 0;
        if ($scope.profile.gender === 'male') {
            bmr = 10 * $scope.profile.weight + 6.25 * $scope.profile.height - 5 * $scope.profile.age + 5;
        } else {
            bmr = 10 * $scope.profile.weight + 6.25 * $scope.profile.height - 5 * $scope.profile.age - 161;
        }
        
        // Adjust based on goal
        switch($scope.profile.goal) {
            case 'lose':
                $scope.calorieGoal = Math.round(bmr * 0.8);
                break;
            case 'gain':
                $scope.calorieGoal = Math.round(bmr * 1.2);
                break;
            default: // maintain
                $scope.calorieGoal = Math.round(bmr);
        }
        
        // Set water goal based on weight (35ml per kg of body weight)
        $scope.waterGoal = Math.round($scope.profile.weight * 35);
    }
    
    // Add water function
    $scope.addWater = function(amount) {
        $scope.currentWater += amount;

        const userId = JSON.parse(localStorage.getItem('userId'));
        if (!userId) {
            alert("User not logged in. Redirecting to login page.");
            $window.location.href = "login.html";
            return;
        }

        // Send updated water intake and profile data to backend
        const payload = {
            userId: userId,
            amount: amount,
            profile: $scope.profile // Include updated profile data
        };
        
        // Update water intake on backend
        $http.post('https://nutri-backend-mocha.vercel.app/api/water', payload)
            .then(function(response) {
                console.log("Water intake updated", response.data);
            })
            .catch(function(error) {
                console.error("Error updating water intake", error);
            });
    };
    
    // Load user data from backend
    function loadUserData() {
        const userId = JSON.parse(localStorage.getItem('userId'));
        if (!userId) {
            alert("User not logged in. Redirecting to login page.");
            $window.location.href = "login.html";
            return;
        }
        $http.get(`https://nutri-backend-mocha.vercel.app/api/user?userId=${userId}`)
            .then(function(response) {
            if (response.data.profile) {
                $scope.profile = response.data.profile;
                calculateGoals();
            }
            if (response.data.currentCalories) {
                $scope.currentCalories = response.data.currentCalories;
            }
            if (response.data.currentWater) {
                $scope.currentWater = response.data.currentWater;
            }
            if (response.data.streak) {
                $scope.streak = response.data.streak;
            }
            })
            .catch(function(error) {
            console.error("Error loading user data", error);
            });
    }
    
    // Initialize
    loadUserData();
    

    // Logout functionality
    $scope.logout = function() {
        $http.post('https://nutri-backend-mocha.vercel.app/api/auth/logout', {}, { 
            withCredentials: true 
        }).then(function(response) {
            alert(response.data.message);
            $window.location.href = "login.html";
        }).catch(function(error) {
            alert(error.data?.message || "Logout failed");
        });
    };
}])
app.controller('MainCtrl', ['$scope', '$http', function($scope, $http) {
    // Landing page content
    $scope.features = [
        { icon: 'fas fa-utensils', title: 'Meal Tracking', desc: 'Track calories and nutrients in every meal' },
        { icon: 'fas fa-tint', title: 'Hydration', desc: 'Monitor daily water intake' },
        { icon: 'fas fa-book', title: 'Recipe Library', desc: '500+ healthy recipes' },
        { icon: 'fas fa-chart-line', title: 'Analytics', desc: 'Detailed progress reports' }
    ];

    $scope.testimonials = [
        { text: "Lost 20lbs in 3 months! Best investment in my health.", author: "Sarah J." },
        { text: "Recipe suggestions made healthy eating easy.", author: "Mike R." },
        { text: "Perfect for tracking my fitness journey.", author: "Emma W." }
    ];

    $scope.faqs = [
        { question: "How do I track meals?", answer: "Use our simple food diary interface or scan barcodes." },
        { question: "Can I cancel anytime?", answer: "Yes, cancel your subscription anytime from your account." },
        { question: "Is my data secure?", answer: "We use bank-level encryption to protect your data." }
    ];

    // Optional recipe loader
    $scope.recipes = [];
    $http.get('js/data.json').then(function(response) {
        $scope.recipes = response.data;
    }).catch(function(error) {
        console.error("Error fetching recipes:", error);
    });
}]);
