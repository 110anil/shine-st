import {getCreds} from "@/pages/api/get-files";

export default function handler (req, res) {
    getCreds(req, res)
}
