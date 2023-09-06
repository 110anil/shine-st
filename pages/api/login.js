import {login} from "@/pages/api/get-files";

export default function handler (req, res) {
    login(req, res)
}
