import { Router, Request, Response, NextFunction } from 'express';
import { PassportStatic } from 'passport';
import { User } from '../model/User';
import { Restaurant } from '../model/Restaurant';
import { Reservation } from '../model/Reservation';

export const configureRoutes = (passport: PassportStatic, router: Router): Router => {

    router.get('/', (req: Request, res: Response) => {
        res.status(200).send('Hello, World!');
    });

    router.post('/login', (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('local', (error: string | null, user: typeof User) => {
            if (error) {
                console.log(error);
                res.status(500).send(error);
            } else {
                if (!user) {
                    res.status(400).send('User not found.');
                } else {
                    req.login(user, (err: string | null) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send('Internal server error.');
                        } else {
                            res.status(200).send(user);
                        }
                    });
                }
            }
        })(req, res, next);
    });

    router.post('/logout', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            req.logout((error) => {
                if (error) {
                    console.log(error);
                    res.status(500).send('Internal server error.');
                }
                res.status(200).send('Successfully logged out.');
            })
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    router.post('/register', (req: Request, res: Response) => {
        const email = req.body.email;
        const password = req.body.password;
        const name = req.body.name;
        const address = req.body.address;
        const nickname = req.body.nickname;
        const user = new User({email: email, password: password, name: name, address: address, nickname: nickname});
        user.save().then(data => {
            res.status(200).send(data);
        }).catch(error => {
            res.status(500).send(error);
        })
    });

    router.get('/checkAuth', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            res.status(200).send(true);
        } else {
            res.status(500).send(false);
        }
    });

    router.get('/restaurants', (req: Request, res: Response) => {
        const query = Restaurant.find();
            query.then((data) => {
                res.status(200).send(data);
            }).catch((error) => {
                console.log(error);
                res.status(500).send('Internal server error.');
            })

    });

    router.get('/restaurants/:id', (req: Request, res: Response) => {
        const id = req.params.id;
        Restaurant.findById(id)
            .then((data) => {
                if (data) {
                    res.status(200).send(data);
                } else {
                    res.status(404).send('Restaurant not found.');
                }
            })
            .catch((error) => {
                console.log(error);
                res.status(500).send('Internal server error.');
            });
    });

    router.put('/updateRestaurant', (req: Request, res: Response) => {
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

            Restaurant.findByIdAndUpdate(id, {
                name: name,
                address: address,
                phone: phone,
                email: email,
                description: description,
                about: about,
                maxCapacity: maxCapacity,
                openingHours: openingHours
            }, {new: true})
                .then((data) => {
                    if (data) {
                        res.status(200).send(data);
                    } else {
                        res.status(404).send('Restaurant not found.');
                    }
                })
                .catch((error) => {
                    console.log(error);
                    res.status(500).send('Internal server error.');
                });
        }
    });

    router.delete('/deleteRestaurant', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const id = req.query.id;
            const query = Restaurant.deleteOne({_id: id});
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send('Internal server error.');
            })
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    router.post('/createRestaurant', (req: Request, res: Response) => {
        const name = req.body.name;
        const address = req.body.address;
        const phone = req.body.phone;
        const email = req.body.email;
        const description = req.body.description;
        const about = req.body.about;
        const maxCapacity = req.body.maxCapacity;
        const openingHours = req.body.openingHours;

        const restaurant = new Restaurant({
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
        })
    });

    router.get('/getAllUsers', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const query = User.find();
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send('Internal server error.');
            })
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    router.get('/user/:id', (req: Request, res: Response) => {
        const id = req.params.id;
        User.findById(id)
            .then((data) => {
                if (data) {
                    res.status(200).send(data);
                } else {
                    res.status(404).send('User not found.');
                }
            })
            .catch((error) => {
                console.log(error);
                res.status(500).send('Internal server error.');
            });
        }
    );

    router.put('/updateUser', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const id = req.body._id;
            const name = req.body.name;
            const address = req.body.address;
            const email = req.body.email;
            const nickname = req.body.nickname;
            console.log('Updating user with id:', id);
            User.findByIdAndUpdate(id, {name: name, address: address, email: email, nickname: nickname}, {new: true})
                .then((data) => {
                    if (data) {
                        req.login(data, (err) => {
                            if (err) {
                                console.log(err);
                                res.status(500).send('Internal server error.');
                            } else {
                                res.status(200).send(data);
                            }
                        });
                    } else {
                        res.status(404).send('User not found.');
                    }
                })
                .catch((error) => {
                    console.log(error);
                    res.status(500).send('Internal server error.');
                });
        }
    });

    router.delete('/deleteUser', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const id = req.query.id;
            const query = User.deleteOne({_id: id});
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send('Internal server error.');
            })
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    router.post('/createReservation', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const restaurantId = req.body.restaurantId;
            const userId = req.body.userId;
            const date = req.body.date;
            const time = req.body.time;
            const numberOfPeople = req.body.numberOfPeople;
            const comment = req.body.comment;
            const status = 'pending';

            const reservation = new Reservation({
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
            })

        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    router.get('/getReservations', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const query = Reservation.find()
                .populate('restaurantId', 'name');
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send('Internal server error.');
            })
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    router.get('/getReservationsByUserId/:id', (req: Request, res: Response) => {
        const userId = req.params.id;
        Reservation.find({ userId: userId })
            .populate('restaurantId', 'name')
            .then((data) => {
                if (data && data.length > 0) {
                    res.status(200).json(data); // Send data as JSON
                } else if (data && data.length === 0) {
                    res.status(200).json({ message: 'Felhasználónak még nem volt foglalása.' }); // Wrap message in JSON
                } else {
                    res.status(500).json({ error: 'Hiba a foglalások lekérdezése során.' }); // Wrap error in JSON
                }
            })
            .catch((error) => {
                console.log(error);
                res.status(500).json({ error: 'Internal server error.' }); // Wrap error in JSON
            });
    });

    router.put('/updateReservationStatus', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const id = req.body._id;
            const status = req.body.status;

            Reservation.findByIdAndUpdate(id, {status: status}, {new: true}).then((data) => {
                if (data) {
                    req.login(data, (err) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send('Internal server error.');
                        } else {
                            res.status(200).send(data);
                        }
                    });
                } else {
                    res.status(404).send('User not found.');
                }
            });
        }
    });

    router.put('/updateReservation', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const id = req.body._id;
            const restaurantId = req.body.restaurantId;
            const userId = req.body.userId;
            const date = req.body.date;
            const time = req.body.time;
            const numberOfPeople = req.body.numberOfPeople;
            const comment = req.body.comment;
            const status = 'pending';

            Reservation.findByIdAndUpdate(id, {
                restaurantId: restaurantId,
                userId: userId,
                date: date,
                time: time,
                numberOfPeople: numberOfPeople,
                comment: comment,
                status: status
            }, {new: true})
                .then((data) => {
                    if (data) {
                        req.login(data, (err) => {
                            if (err) {
                                console.log(err);
                                res.status(500).send('Internal server error.');
                            } else {
                                res.status(200).send(data);
                            }
                        });
                    } else {
                        res.status(404).send('User not found.');
                    }
                })
                .catch((error) => {
                    console.log(error);
                    res.status(500).send('Internal server error.');
                });
        }
    });

    router.delete('/deleteReservation/:id', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const id = req.params.id;
            Reservation.findByIdAndDelete(id)
                .then((data) => {
                    if (data) {
                        res.status(200).send(data);
                    } else {
                        res.status(404).send('Reservation not found.');
                    }
                })
                .catch((error) => {
                    console.log(error);
                    res.status(500).send('Internal server error.');
                });
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    return router;
}