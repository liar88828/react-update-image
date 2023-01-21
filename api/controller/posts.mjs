import {db} from "../connect.mjs";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getPosts = (req, res) => {
	const token = req.cookies.accessToken;
	if (!token) return res.status(401).json('not login')
	jwt.verify(token, 'secretkey', (err, userInfo) => {
		if (err) return res.status(403).json('token is not valid')
		const q = `SELECT p.*, name, profile_pic
               FROM post p
                        JOIN users u ON u.id = p.userId
                        LEFT JOIN relationships r ON u.id = r.followedUserId
               WHERE r.followUserId = ?
                  OR p.userId = ?
               ORDER BY createAt desc `; // AND r.followUserId =?// hanya untuk only saja
		db.query(q, [userInfo.id, userInfo.id], (err, data) => {
			if (err) return res.status(500).json(err)
			return res.status(200).json(data)
		})
	})
}

export const postPost = (req, res) => {
	const token = req.cookies.accessToken;
	if (!token) return res.status(401).json('not login')
	jwt.verify(token,
			'secretkey',
			(err, userInfo) => {
				if (err) return res.status(403).json('token is not valid')
				const q = "INSERT INTO post(`descrp`, `img`, `createAt`, `userId`) VALUES (?)";
				const rb = req.body
				const values = [
					rb.descrp,
					rb.img,
					moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
					userInfo.id
				]
				db.query(q, [values], (err) => {
					if (err) return res.status(500).json(err)
					return res.status(200).json('post has been create')
				})
			})
}