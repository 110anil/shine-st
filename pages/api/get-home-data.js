import {getData} from "@/pages/api/get-files";


export default function handler (req, res) {
    getData(req.body.keys).then(data => res.status(200).json({done: true, data})).catch((error) => ({done: false, error}))
}