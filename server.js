import express from "express";

//initialising express
const app = express();

const PORT = process.env.PORT || 5000;
//Data
const rooms = [
    {
        id: 1,
        name: "Hall 1",
        totalSeats: 135,
        amenities: [
            "Full A/c",
            "Free Parking",
            "Wifi",
            "Security Cameras"
        ],
        pricePerHourInRupees: 20000
    },
    {
        id: 2,
        name: "Hall 2",
        totalSeats: 155,
        amenities: [
            "Full A/c",
            "Free Parking",
            "Wifi",
            "Security Cameras"
        ],
        pricePerHourInRupees: 40000
    }
]
const BookedRooms = [
    {
        "id": 1,
        "name": "Person 1",
        "roomID": 2,
        "status": "booked",
        "date": "02 sep 2021",
        "startTime": "5:00:00",
        "endTime": "8:00:00"
    },
    {
        "id": 2,
        "name": "Person 2",
        "roomID": 2,
        "status": "booked",
        "date": "04 sep 2021",
        "startTime": "16:00:00",
        "endTime": "20:00:00"
    },
    {
        "id": 3,
        "name": "Person 3",
        "roomID": 1,
        "status": "booked",
        "date": "02 sep 2021",
        "startTime": "5:00:00",
        "endTime": "8:00:00"
    }
]

//Middleware
app.use(express.json())

//Create Room
app.post("/create-room", (req, res) => {
    try {
        const obj = {
            id: rooms.length + 1,
            ...req.body
        }
        rooms.push(obj);
        console.log(rooms);
        res.json({
            message: "Room created!"
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
})

//Book a room
app.post('/book-room', (req, res) => {
    try {
        //Booking details from request
        const bookingdata = req.body.roomID;
        const BookedDateStartTime = new Date(`${req.body.date} ${req.body.startTime}`);
        //Check already Booked
        const alreadyBooked = BookedRooms.some(detail => {
            const detailDateStartTime = new Date(`${detail.date} ${detail.startTime}`);
            const detailDateEndTime = new Date(`${detail.date} ${detail.endTime}`);
            if (detail.roomID === bookingdata && BookedDateStartTime >= detailDateStartTime && BookedDateStartTime <= detailDateEndTime) {
                return true;
            }
        })

        if (alreadyBooked) {
            res.json({
                message: "Room not available for that date and time!"
            })
        } else {
            BookedRooms.push({
                bookedStatus: true,
                ...req.body
            })
            res.json({
                message: "Room booked!"
            })
        }

    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
})

//List all rooms

app.get('/rooms', (req, res) => {
    try {
        const data = BookedRooms.map(room => {
            const roomIndex = rooms.findIndex(obj => obj.id === room.roomID)
            return {
                roomName: rooms[roomIndex].name,
                customerName: room.name,
                bookedStatus: room.status,
                date: room.date,
                startTime: room.startTime,
                endTime: room.endTime
            }
        })
        res.send(data);
    } catch (error) {
        res.status(500).json({
            message: "Internal server error!"
        })
    }
})

//List all customers
app.get('/customers', (req, res) => {
    try {
        const data = BookedRooms.map(room => {
            const roomIndex = rooms.findIndex(obj => obj.id === room.roomID)
            return {
                customerName: room.name,
                roomName: rooms[roomIndex].name,
                date: room.date,
                startTime: room.startTime,
                endTime: room.endTime
            }
        })
        res.send(data);
    } catch (error) {
        res.status(500).json({
            message: "Internal server error!"
        })
    }
})

//Listening to port
app.listen(PORT, () => console.log(`App is listening in port ${PORT}`))