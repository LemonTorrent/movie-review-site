import { clearAuthCookie } from "../../lib/auth"

export default async function logout(req, res) {
    if (req.method !== "POST") {
        res.status(405).send({ err: "Only POSTs are accepted here" })
    }else{
        clearAuthCookie(res)
        res.status(200).send({ msg: "Signed Out" })
    }
}
