import {renameFiles} from "@/pages/api/get-files";

export default function handler (req, res) {
    renameFiles(req, res)
}
