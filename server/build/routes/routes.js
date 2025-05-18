"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureRoutes = void 0;
const User_1 = require("../model/User");
const Restaurant_1 = require("../model/Restaurant");
const Reservation_1 = require("../model/Reservation");
const configureRoutes = (passport, router) => {
    router.get('/', (req, res) => {
        res.status(200).send('Hello, World!');
    });
    router.post('/login', (req, res, next) => {
        passport.authenticate('local', (error, user) => {
            if (error) {
                console.log(error);
                res.status(500).send(error);
            }
            else {
                if (!user) {
                    res.status(400).send('User not found.');
                }
                else {
                    req.login(user, (err) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send('Internal server error.');
                        }
                        else {
                            res.status(200).send(user);
                        }
                    });
                }
            }
        })(req, res, next);
    });
    router.post('/logout', (req, res) => {
        if (req.isAuthenticated()) {
            req.logout((error) => {
                if (error) {
                    console.log(error);
                    res.status(500).send('Internal server error.');
                }
                res.status(200).send('Successfully logged out.');
            });
        }
        else {
            res.status(500).send('User is not logged in.');
        }
    });
    router.post('/register', (req, res) => {
        const email = req.body.email;
        const password = req.body.password;
        const name = req.body.name;
        const address = req.body.address;
        const nickname = req.body.nickname;
        const user = new User_1.User({ email: email, password: password, name: name, address: address, nickname: nickname });
        user.save().then(data => {
            res.status(200).send(data);
        }).catch(error => {
            res.status(500).send(error);
        });
    });
    router.get('/checkAuth', (req, res) => {
        if (req.isAuthenticated()) {
            res.status(200).send(true);
        }
        else {
            res.status(500).send(false);
        }
    });
    router.get('/restaurants', (req, res) => {
        const query = Restaurant_1.Restaurant.find();
        query.then((data) => {
            res.status(200).send(data);
        }).catch((error) => {
            console.log(error);
            res.status(500).send('Internal server error.');
        });
    });
    router.get('/restaurants/:id', (req, res) => {
        const id = req.params.id;
        Restaurant_1.Restaurant.findById(id)
            .then((data) => {
            if (data) {
                res.status(200).send(data);
            }
            else {
                res.status(404).send('Restaurant not found.');
            }
        })
            .catch((error) => {
            console.log(error);
            res.status(500).send('Internal server error.');
        });
    });
    router.put('/updateRestaurant', (req, res) => {
        if (req.isAuthenticated()) {
            const id = req.body._id;
            const name = req.body.name;
            const address = req.body.address;
            const phone = req.body.phone;
            const email = req.body.email;
            const description = req.body.description;
            const about = req.body.about;
            const maxCapacity = req.body.maxCapacity;
            const openingHours = req.body.openingHours;
            Restaurant_1.Restaurant.findByIdAndUpdate(id, {
                name: name,
                address: address,
                phone: phone,
                email: email,
                description: description,
                about: about,
                maxCapacity: maxCapacity,
                openingHours: openingHours
            }, { new: true })
                .then((data) => {
                if (data) {
                    res.status(200).send(data);
                }
                else {
                    res.status(404).send('Restaurant not found.');
                }
            })
                .catch((error) => {
                console.log(error);
                res.status(500).send('Internal server error.');
            });
        }
    });
    router.delete('/deleteRestaurant', (req, res) => {
        if (req.isAuthenticated()) {
            const id = req.query.id;
            const query = Restaurant_1.Restaurant.deleteOne({ _id: id });
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send('Internal server error.');
            });
        }
        else {
            res.status(500).send('User is not logged in.');
        }
    });
    router.post('/createRestaurant', (req, res) => {
        const name = req.body.name;
        const address = req.body.address;
        const phone = req.body.phone;
        const email = req.body.email;
        const description = req.body.description;
        const about = req.body.about;
        const maxCapacity = req.body.maxCapacity;
        const openingHours = req.body.openingHours;
        const restaurant = new Restaurant_1.Restaurant({
            name: name,
            address: address,
            phone: phone,
            email: email,
            description: description,
            about: about,
            maxCapacity: maxCapacity,
            openingHours: openingHours
        });
        restaurant.save().then(data => {
            res.status(200).send(data);
        }).catch(error => {
            res.status(500).send(error);
        });
    });
    router.get('/getAllUsers', (req, res) => {
        if (req.isAuthenticated()) {
            const query = User_1.User.find();
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send('Internal server error.');
            });
        }
        else {
            res.status(500).send('User is not logged in.');
        }
    });
    router.get('/user/:id', (req, res) => {
        const id = req.params.id;
        User_1.User.findById(id)
            .then((data) => {
            if (data) {
                res.status(200).send(data);
            }
            else {
                res.status(404).send('User not found.');
            }
        })
            .catch((error) => {
            console.log(error);
            res.status(500).send('Internal server error.');
        });
    });
    router.put('/updateUser', (req, res) => {
        if (req.isAuthenticated()) {
            const id = req.body._id;
            const name = req.body.name;
            const address = req.body.address;
            const email = req.body.email;
            const nickname = req.body.nickname;
            console.log('Updating user with id:', id);
            User_1.User.findByIdAndUpdate(id, { name: name, address: address, email: email, nickname: nickname }, { new: true })
                .then((data) => {
                if (data) {
                    req.login(data, (err) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send('Internal server error.');
                        }
                        else {
                            res.status(200).send(data);
                        }
                    });
                }
                else {
                    res.status(404).send('User not found.');
                }
            })
                .catch((error) => {
                console.log(error);
                res.status(500).send('Internal server error.');
            });
        }
    });
    router.delete('/deleteUser', (req, res) => {
        if (req.isAuthenticated()) {
            const id = req.query.id;
            const query = User_1.User.deleteOne({ _id: id });
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send('Internal server error.');
            });
        }
        else {
            res.status(500).send('User is not logged in.');
        }
    });
    router.post('/createReservation', (req, res) => {
        if (req.isAuthenticated()) {
            const restaurantId = req.body.restaurantId;
            const userId = req.body.userId;
            const date = req.body.date;
            const time = req.body.time;
            const numberOfPeople = req.body.numberOfPeople;
            const comment = req.body.comment;
            const status = 'pending';
            const reservation = new Reservation_1.Reservation({
                restaurantId: restaurantId,
                userId: userId,
                date: date,
                time: time,
                numberOfPeople: numberOfPeople,
                comment: comment,
                status: status
            });
            reservation.save().then(data => {
                res.status(200).send(data);
            }).catch(error => {
                res.status(500).send(error);
            });
        }
        else {
            res.status(500).send('User is not logged in.');
        }
    });
    router.get('/getReservations', (req, res) => {
        if (req.isAuthenticated()) {
            const query = Reservation_1.Reservation.find()
                .populate('restaurantId', 'name');
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send('Internal server error.');
            });
        }
        else {
            res.status(500).send('User is not logged in.');
        }
    });
    router.get('/getReservationsByUserId/:id', (req, res) => {
        const userId = req.params.id;
        Reservation_1.Reservation.find({ userId: userId })
            .populate('restaurantId', 'name')
            .then((data) => {
            if (data && data.length > 0) {
                res.status(200).json(data); // Send data as JSON
            }
            else if (data && data.length === 0) {
                res.status(200).json({ message: 'Felhasználónak még nem volt foglalása.' }); // Wrap message in JSON
            }
            else {
                res.status(500).json({ error: 'Hiba a foglalások lekérdezése során.' }); // Wrap error in JSON
            }
        })
            .catch((error) => {
            console.log(error);
            res.status(500).json({ error: 'Internal server error.' }); // Wrap error in JSON
        });
    });
    router.put('/updateReservationStatus', (req, res) => {
        if (req.isAuthenticated()) {
            const id = req.body._id;
            const status = req.body.status;
            Reservation_1.Reservation.findByIdAndUpdate(id, { status: status }, { new: true }).then((data) => {
                if (data) {
                    req.login(data, (err) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send('Internal server error.');
                        }
                        else {
                            res.status(200).send(data);
                        }
                    });
                }
                else {
                    res.status(404).send('User not found.');
                }
            });
        }
    });
    router.put('/updateReservation', (req, res) => {
        if (req.isAuthenticated()) {
            const id = req.body._id;
            const restaurantId = req.body.restaurantId;
            const userId = req.body.userId;
            const date = req.body.date;
            const time = req.body.time;
            const numberOfPeople = req.body.numberOfPeople;
            const comment = req.body.comment;
            const status = 'pending';
            Reservation_1.Reservation.findByIdAndUpdate(id, {
                restaurantId: restaurantId,
                userId: userId,
                date: date,
                time: time,
                numberOfPeople: numberOfPeople,
                comment: comment,
                status: status
            }, { new: true })
                .then((data) => {
                if (data) {
                    req.login(data, (err) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send('Internal server error.');
                        }
                        else {
                            res.status(200).send(data);
                        }
                    });
                }
                else {
                    res.status(404).send('User not found.');
                }
            })
                .catch((error) => {
                console.log(error);
                res.status(500).send('Internal server error.');
            });
        }
    });
    router.delete('/deleteReservation/:id', (req, res) => {
        if (req.isAuthenticated()) {
            const id = req.params.id;
            Reservation_1.Reservation.findByIdAndDelete(id)
                .then((data) => {
                if (data) {
                    res.status(200).send(data);
                }
                else {
                    res.status(404).send('Reservation not found.');
                }
            })
                .catch((error) => {
                console.log(error);
                res.status(500).send('Internal server error.');
            });
        }
        else {
            res.status(500).send('User is not logged in.');
        }
    });
    return router;
};
exports.configureRoutes = configureRoutes;
