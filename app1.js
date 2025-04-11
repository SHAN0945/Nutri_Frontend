// Main AngularJS Application
angular.module('healthTracker', [])


// Hydration Controller
.controller('HydrationCtrl', ['$scope', '$http', function($scope, $http) {
    const userId = JSON.parse(localStorage.getItem('userId'));
    if (!userId) {
        alert("User not logged in. Redirecting to login page.");
        $window.location.href = "login.html";
        return;
    }
    $http.get(`https://nutri-backend-mocha.vercel.app//api/user?userId=${userId}`)
    .then(function(response) {
    console.log("User data loaded", response.data);
    if (response.data.profile) {
        $scope.profile = response.data.profile;
        $scope.waterGoal = Math.round($scope.profile.weight * 35);
    }
    if (response.data.currentWater!=null) {
        console.log("water data loaded", response.data);
        $scope.currentWater = response.data.currentWater;
    }
    })
    .catch(function(error) {
    console.error("Error loading user data", error);
    });
    
    // $scope.waterGoal = 2000;  // Default value until we fetch from backend
    // $scope.currentWater = 1000;
    // $scope.weeklyData = [];
    // $scope.waterHistory = [];
    // $scope.Math = window.Math;
    
    // Mock weekly data
    $scope.weeklyData = [
        { label: 'Mon', value: 2200 },
        { label: 'Tue', value: 1800 },
        { label: 'Wed', value: 2500 },
        { label: 'Thu', value: 2300 },
        { label: 'Fri', value: 1500 },
        { label: 'Sat', value: 2000 },
        { label: 'Sun', value: 2400 }
    ];
    
    // Mock history data
    $scope.waterHistory = [
        { date: 'Apr 3, 2025', amount: 2200, goal: 2500 },
        { date: 'Apr 2, 2025', amount: 1800, goal: 2500 },
        { date: 'Apr 1, 2025', amount: 2500, goal: 2500 },
        { date: 'Mar 31, 2025', amount: 2300, goal: 2500 },
        { date: 'Mar 30, 2025', amount: 1500, goal: 2500 }
    ];
    
    
    // // Add water function - now fully integrated with backend
    // $scope.addWater = function(amount) {
    //     console.log('Custom Amount:', amount);
    //     if (amount > 0) {
    //         const userId = JSON.parse(localStorage.getItem('userId'));
    //         if (!userId) {
    //             alert("User not logged in. Redirecting to login page.");
    //             $window.location.href = "login.html";
    //             return;
    //         }
    //         $http.post('https://nutri-backend-mocha.vercel.app//api/water', 
    //                   { amount: amount , id:userId})  // Crucial for session cookies
    //             .then(function(response) {
    //                 // Update local data only after successful backend update
    //                 $scope.currentWater += parseInt(amount);
    //                 console.log("Water intake updated", response.data);
                    
    //                 // Refresh data from backend to ensure consistency
    //                 loadUserData();
    //             })
    //             .catch(function(error) {
    //                 console.error("Error updating water intake", error);
    //                 alert('Failed to log water. Please try again.');
    //             });
    //     }
    // };
    

    // Add water function - now sends updated profile and water intake
    $scope.addWater = function(amount) {
        if (amount > 0) {
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

            $http.post('https://nutri-backend-mocha.vercel.app//api/water', payload)
                .then(function(response) {
                    // Update local data only after successful backend update
                    $scope.currentWater += parseInt(amount);
                    console.log("Water intake and profile updated", response.data);

                    // Refresh data from backend to ensure consistency
                    loadUserData();
                })
                .catch(function(error) {
                    console.error("Error updating water intake and profile", error);
                    alert('Failed to log water. Please try again.');
                });
        }
    };




    // Load user data
    function loadUserData() {
        // Get today's water intake
        $http.get('http:/localhost:5000/api/water/today', { withCredentials: true })
            .then(function(response) {
                if (response.data.amount) {
                    $scope.currentWater = response.data.amount;
                }
                if (response.data.goal) {
                    $scope.waterGoal = response.data.goal;
                }
            })
            .catch(function(error) {
                console.error("Error loading today's water data", error);
            });

        // Get weekly data
        $http.get('http://127.0.0.1:5000/api/water/weekly', { withCredentials: true })
            .then(function(response) {
                $scope.weeklyData = response.data;
            })
            .catch(function(error) {
                console.error("Error loading weekly data", error);
            });

        // Get water history
        $http.get('http://127.0.0.1:5000/api/water/history', { withCredentials: true })
            .then(function(response) {
                $scope.waterHistory = response.data.map(item => ({
                    date: new Date(item.date).toLocaleDateString(),
                    amount: item.amount,
                    goal: item.goal,
                    achievementRate: Math.round((item.amount / item.goal) * 100)
                }));
            })
            .catch(function(error) {
                console.error("Error loading water history", error);
            });
     }
    
    // Initialize
    loadUserData();
    // Set up auto-refresh every 5 minutes
    setInterval(loadUserData, 300000);
}])

// Calendar Controller
.controller('CalendarCtrl', ['$scope', '$http', function($scope, $http) {
    const mockCalendars = {
        '3-2025': generateMarch(),
        '4-2025': generateApril(),
        '5-2025': generateMay()
    };
    
    $scope.currentMonth = 'April';
    $scope.currentYear = 2025;
    $scope.streak = 7;
    $scope.calendar = mockCalendars['4-2025'];
    
    $scope.stats = {
        waterGoalMetDays: 18,
        calorieGoalMetDays: 15,
        allGoalsMetDays: 12,
        longestStreak: 10,
        totalDays: 30
    };
    
    // Hardcoded calendar data for March
    function generateMarch() {
        return [
            [
                { date: null }, { date: null }, { date: null }, { date: null },
                { date: 1, waterMet: true, caloriesMet: true, goalsMet: 2 },
                { date: 2, waterMet: false, caloriesMet: true, goalsMet: 1 },
                { date: 3, waterMet: false, caloriesMet: false, goalsMet: 0 }
            ],
            [
                { date: 4, waterMet: true, caloriesMet: false, goalsMet: 1 },
                { date: 5, waterMet: false, caloriesMet: true, goalsMet: 1 },
                { date: 6, waterMet: true, caloriesMet: true, goalsMet: 2 },
                { date: 7, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 8, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 9, waterMet: true, caloriesMet: true, goalsMet: 2 },
                { date: 10, waterMet: false, caloriesMet: true, goalsMet: 1 }
            ],
            [
                { date: 11, waterMet: true, caloriesMet: true, goalsMet: 2 },
                { date: 12, waterMet: true, caloriesMet: false, goalsMet: 1 },
                { date: 13, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 14, waterMet: false, caloriesMet: true, goalsMet: 1 },
                { date: 15, waterMet: true, caloriesMet: true, goalsMet: 2 },
                { date: 16, waterMet: true, caloriesMet: false, goalsMet: 1 },
                { date: 17, waterMet: true, caloriesMet: true, goalsMet: 2 }
            ],
            [
                { date: 18, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 19, waterMet: false, caloriesMet: true, goalsMet: 1 },
                { date: 20, waterMet: true, caloriesMet: true, goalsMet: 2 },
                { date: 21, waterMet: true, caloriesMet: true, goalsMet: 2 },
                { date: 22, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 23, waterMet: true, caloriesMet: false, goalsMet: 1 },
                { date: 24, waterMet: true, caloriesMet: true, goalsMet: 2 }
            ],
            [
                { date: 25, waterMet: false, caloriesMet: true, goalsMet: 1 },
                { date: 26, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 27, waterMet: true, caloriesMet: true, goalsMet: 2 },
                { date: 28, waterMet: false, caloriesMet: true, goalsMet: 1 },
                { date: 29, waterMet: true, caloriesMet: true, goalsMet: 2 },
                { date: 30, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 31, waterMet: true, caloriesMet: true, goalsMet: 2 }
            ]
        ];
    }
    
    // April — you already had this
    function generateApril() {
        return [
            [
                { date: null, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: null, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: null, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: null, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 1, waterMet: true, caloriesMet: true, goalsMet: 2 },
                { date: 2, waterMet: true, caloriesMet: false, goalsMet: 1 },
                { date: 3, waterMet: false, caloriesMet: false, goalsMet: 0 }
            ],
            [
                { date: 4, waterMet: true, caloriesMet: true, goalsMet: 2},
                { date: 5, waterMet: false, caloriesMet: true, goalsMet: 1 },
                { date: 6, waterMet: true, caloriesMet: true, goalsMet: 2 },
                { date: 7, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 8, waterMet: true, caloriesMet: false, goalsMet: 1 },
                { date: 9, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 10, waterMet: true, caloriesMet: false, goalsMet: 1 }
            ],
            [
                { date: 11, waterMet: true, caloriesMet: false, goalsMet: 1,isToday: true  },
                { date: 12, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 13, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 14, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 15, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 16, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 17, waterMet: false, caloriesMet: false, goalsMet: 0 }
            ],
            [
                { date: 18, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 19, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 20, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 21, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 22, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 23, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 24, waterMet: false, caloriesMet: false, goalsMet: 0 }
            ],
            [
                { date: 25, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 26, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 27, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 28, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 29, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 30, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: null, waterMet: false, caloriesMet: false, goalsMet: 0 }
            ]
        ];
            }
    
    
    // May 2025
    function generateMay() {
        return [
            [
                { date: null }, { date: null }, { date: null }, { date: 1, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 2, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 3, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 4, waterMet: false, caloriesMet: false, goalsMet: 0 }
            ],
            [
                { date: 5, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 6, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 7, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 8, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 9, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 10, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 11, waterMet: false, caloriesMet: false, goalsMet: 0 }
            ],
            [
                { date: 12, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 13, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 14, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 15, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 16, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 17, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 18, waterMet: false, caloriesMet: false, goalsMet: 0 }
            ],
            [
                { date: 19, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 20, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 21, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 22, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 23, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 24, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 25, waterMet: false, caloriesMet: false, goalsMet: 0 }
            ],
            [
                { date: 26, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 27, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 28, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 29, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 30, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: 31, waterMet: false, caloriesMet: false, goalsMet: 0 },
                { date: null }
            ]
        ];
        
    }
    
    // Month change handlers
    $scope.previousMonth = function() {
        if ($scope.currentMonth === 'April') {
            $scope.currentMonth = 'March';
            $scope.calendar = mockCalendars['3-2025'];
        } else if ($scope.currentMonth === 'May') {
            $scope.currentMonth = 'April';
            $scope.calendar = mockCalendars['4-2025'];
        } else {
            alert('No earlier month data.');
        }
    };
    
    $scope.nextMonth = function() {
        if ($scope.currentMonth === 'March') {
            $scope.currentMonth = 'April';
            $scope.calendar = mockCalendars['4-2025'];
        } else if ($scope.currentMonth === 'April') {
            $scope.currentMonth = 'May';
            $scope.calendar = mockCalendars['5-2025'];
        } else {
            alert('No future month data.');
        }
    };
    
    
    
}])

// Food Entry Controller
.controller('FoodEntryCtrl', ['$scope', '$http', function($scope, $http) {
    // Initialize data
    $scope.calorieGoal = 2000;
    $scope.totalCalories = 0;
    $scope.mealTotals = {
        breakfast: 0,
        lunch: 0,
        dinner: 0,
        snacks: 0
    };
    
    // Current date
    $scope.currentDate = 'April 4, 2025';
    
    // Meals data
    $scope.meals = {
        breakfast: [],
        lunch: [],
        dinner: [],
        snacks: []
    };
    
    // New food item
    $scope.newFood = {
        name: '',
        calories: 0
    };
    
    // Selected meal type (for adding food)
    $scope.selectedMealType = '';
    
    // Recent foods
    $scope.recentFoods = [
        { name: "Banana", calories: 105, lastAdded: "yesterday" },
        { name: "Hard-boiled Egg", calories: 78, lastAdded: "3 days ago" },
        { name: "Almonds (1 oz)", calories: 164, lastAdded: "last week" }
    ];
    
    // Calculate total calories
    function calculateTotals() {
        $scope.mealTotals = {
            breakfast: 0,
            lunch: 0,
            dinner: 0,
            snacks: 0
        };
        
        Object.keys($scope.meals).forEach(function(mealType) {
            $scope.meals[mealType].forEach(function(food) {
                $scope.mealTotals[mealType] += food.calories;
            });
        });
        
        $scope.totalCalories = $scope.mealTotals.breakfast + $scope.mealTotals.lunch + $scope.mealTotals.dinner + $scope.mealTotals.snacks;
    }
    
    calculateTotals();
    
    // Show add food modal
    $scope.showAddFoodModal = function(mealType) {
        $scope.selectedMealType = mealType;
        $scope.newFood = { name: '', calories: 0 };
        $('#addFoodModal').modal('show');
    };
    
    // Add food
    $scope.addFood = function() {
        if ($scope.selectedMealType && $scope.newFood.name && $scope.newFood.calories > 0) {
            $scope.meals[$scope.selectedMealType].push({
                name: $scope.newFood.name,
                calories: parseInt($scope.newFood.calories)
            });
            
            calculateTotals();
            
            // Close modal
            $('#addFoodModal').modal('hide');

            const userId = JSON.parse(localStorage.getItem('userId'));
            if (!userId) {
                alert("User not logged in. Redirecting to login page.");
                $window.location.href = "login.html";
                return;
            }

            // Send updated water intake and profile data to backend
            const payload = {
                userId: userId,
                name: $scope.newFood.name,
                calories: parseInt($scope.newFood.calories),
                mealType: $scope.selectedMealType,
            };

            // Update on backend
            $http.post('https://nutri-backend-mocha.vercel.app//api/meals', payload)
            .then(function(response) {
                console.log("Meal added successfully", response.data);
            })
            .catch(function(error) {
                console.error("Error adding meal", error);
            });
        }
    };
    
    // Add recent food
    $scope.addRecentFood = function(food) {
        $scope.showAddFoodModal('breakfast'); // Default to breakfast
        $scope.newFood = {
            name: food.name,
            calories: food.calories
        };
    };
    
    // Remove food
    $scope.removeFood = function(mealType, index) {
        $scope.meals[mealType].splice(index, 1);
        calculateTotals();
        
        const userId = JSON.parse(localStorage.getItem('userId'));
        if (!userId) {
            alert("User not logged in. Redirecting to login page.");
            $window.location.href = "login.html";
            return;
        }
        $http.post('https://nutri-backend-mocha.vercel.app//api/meals/delete', {
            userId: userId,
            mealType: mealType,
            index: index
        })
        .then(function(response) {
            console.log("Meal removed successfully", response.data);
        })
        .catch(function(error) {
            console.error("Error removing meal", error);
        });
    };
    
    // Change date
    $scope.previousDay = function() {
        // In real app, change date and reload meals
        alert("Navigating to previous day");
    };
    
    $scope.nextDay = function() {
        // In real app, change date and reload meals
        alert("Navigating to next day");
    };
    
    // Load user data
    

    
    
    function loadUserData() {
        const userId = JSON.parse(localStorage.getItem('userId'));
        if (!userId) {
            alert("User not logged in. Redirecting to login page.");
            $window.location.href = "login.html";
            return;
        }
        $http.get(`https://nutri-backend-mocha.vercel.app//api/user?userId=${userId}`)
            .then(function(response) {
            console.log("User data loaded", response.data);
            if (response.data.currentCalories) {
                $scope.meals = response.data.meals;
                $scope.currentCalories = response.data.currentCalories;
                $scope.calorieGoal = response.data.calorieGoal;
                calculateTotals()
                // $scope.$apply()
            }
            if (response.data.currentWater) {
                $scope.currentWater = response.data.currentWater;
            }
            })
            .catch(function(error) {
            console.error("Error loading user data", error);
            });
        // Load meals for today
        $http.get('https://nutri-backend-mocha.vercel.app//api/user/meals/today')
            .then(function(response) {
                if (response.data.meals) {
                    $scope.meals = response.data.meals;
                    calculateTotals();
                }
                if (response.data.recentFoods) {
                    $scope.recentFoods = response.data.recentFoods;
                }
            })
            .catch(function(error) {
                console.error("Error loading meals", error);
            });
    }
    
    // Initialize
    loadUserData();
}])

// Appointments Controller
.controller('AppointmentsCtrl', ['$scope', '$http', function($scope, $http) {
    // Initialize data
    $scope.appointments = [
        {
            doctor: "Dr. Sarah Johnson",
            specialty: "Nutritionist",
            date: "April 10, 2025",
            time: "2:30 PM",
            purpose: "Nutrition Consultation"
        },
        {
            doctor: "Dr. Michael Rodriguez",
            specialty: "Fitness Specialist",
            date: "April 15, 2025",
            time: "10:00 AM",
            purpose: "Fitness Assessment"
        }
    ];
    
    $scope.appointmentHistory = [
        {
            doctor: "Dr. Sarah Johnson",
            specialty: "Nutritionist",
            date: "March 10, 2025",
            time: "2:30 PM",
            purpose: "Initial Consultation",
            status: "Completed"
        },
        {
            doctor: "Dr. David Lee",
            specialty: "Dietitian",
            date: "February 25, 2025",
            time: "11:00 AM",
            purpose: "Diet Review",
            status: "Cancelled"
        }
    ];
    
    $scope.doctors = [
        { id: 1, name: "Sarah Johnson", specialty: "Nutritionist" },
        { id: 2, name: "Michael Rodriguez", specialty: "Fitness Specialist" },
        { id: 3, name: "David Lee", specialty: "Dietitian" },
        { id: 4, name: "Emily Chen", specialty: "Health Coach" }
    ];
    
    $scope.newAppointment = {
        doctorId: '',
        date: '',
        time: '',
        purpose: ''
    };
    
    $scope.availableDates = [];
    $scope.availableSlots = [];
    
    // Select doctor
    $scope.selectDoctor = function() {
        // In a real app, fetch available dates for the selected doctor
        $scope.availableDates = ['April 10, 2025', 'April 11, 2025', 'April 12, 2025', 'April 15, 2025'];
    };
    
    // Get available time slots
    $scope.getAvailableSlots = function() {
        // In a real app, fetch available time slots for the selected date and doctor
        $scope.availableSlots = ['9:00 AM', '10:30 AM', '2:00 PM', '3:30 PM'];
    };
    
    // Schedule appointment
    $scope.scheduleAppointment = function() {
        // Find doctor
        const doctor = $scope.doctors.find(d => d.id == $scope.newAppointment.doctorId);
        
        if (doctor && $scope.newAppointment.date && $scope.newAppointment.time && $scope.newAppointment.purpose) {
            // Create appointment
            const userId = JSON.parse(localStorage.getItem('userId'));
            if (!userId) {
                alert("User not logged in. Redirecting to login page.");
                $window.location.href = "login.html";
                return;
            }
            const appointment = {
                doctor: "Dr. " + doctor.name,
                specialty: doctor.specialty,
                date: $scope.newAppointment.date,
                time: $scope.newAppointment.time,
                purpose: $scope.newAppointment.purpose,
                userId: userId,
            };
            
            // Add to appointments
            $scope.appointments.push(appointment);
            
            // Reset form
            $scope.newAppointment = {
                doctorId: '',
                date: '',
                time: '',
                purpose: ''
            };
            
            // Update on backend
            $http.post('https://nutri-backend-mocha.vercel.app//api/appointments', appointment)
                .then(function(response) {
                    console.log("Appointment scheduled successfully", response.data);
                })
                .catch(function(error) {
                    console.error("Error scheduling appointment", error);
                });
        }
    };
    
    // Cancel appointment
    $scope.cancelAppointment = function(index) {
        // In a real app, show confirmation dialog
        
        // Add to history with cancelled status
        const appointment = $scope.appointments[index];
        appointment.status = "Cancelled";

        $scope.appointmentHistory.unshift(appointment);
        
        // Remove from upcoming
        $scope.appointments.splice(index, 1);
        
        // Update on backend
        $http.post('https://nutri-backend-mocha.vercel.app//api/appointments/delete',{ id: appointment._id })
            .then(function(response) {
                console.log("Appointment cancelled successfully", response.data);
            })
            .catch(function(error) {
                console.error("Error cancelling appointment", error);
            });
    };
    
    // Load appointments
    function loadAppointments() {
        const userId = JSON.parse(localStorage.getItem('userId'));
        if (!userId) {
            alert("User not logged in. Redirecting to login page.");
            $window.location.href = "login.html";
            return;
        }
        // Load appointments for today
        $http.get(`https://nutri-backend-mocha.vercel.app//api/appointments?userId=${userId}`)
            .then(function(response) {
                if (response.data.appointments) {
                    $scope.appointments = response.data.appointments;
                }
                if (response.data.history) {
                    $scope.appointmentHistory = response.data.history;
                }
            })
            .catch(function(error) {
                console.error("Error loading appointments", error);
            });
            
        // Load doctors
        $http.get('/api/doctors')
            .then(function(response) {
                if (response.data.doctors) {
                    $scope.doctors = response.data.doctors;
                }
            })
            .catch(function(error) {
                console.error("Error loading doctors", error);
            });
    }
    
    // Initialize
    loadAppointments();
}]);
