import bcrypt from "bcryptjs"

const Users = [
    {
        name: "Admin User",
        email: "admin@example.com",
        password: bcrypt.hashSync("123456", 10),
        isAdmin: true
    },
    {
        name: "Harry Potter",
        email: "harry@example.com",
        password: bcrypt.hashSync("123456", 10),
    },
    {
        name: "Elon Bezos",
        email: "elon@example.com",
        password: bcrypt.hashSync("123456", 10),
    }
]

export default Users;