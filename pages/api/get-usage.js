import {getUsage} from "@/pages/api/get-files";

export default function handler (req, res) {
    getUsage(req, res)
}
