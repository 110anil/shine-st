import {accounts} from "@/pages/api/get-files";

export default function handler (req, res) {
    res.status(200).json(accounts)
}
