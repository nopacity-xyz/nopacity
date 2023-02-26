import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
	output: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	const { token } = req.body;
	const { governor } = req.body;
	console.log(JSON.stringify(token));
	console.log(JSON.stringify(governor));
	res.status(200);
	res.send({ output: "Success!" });
}
