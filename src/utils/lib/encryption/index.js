import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.REACT_APP_SECURE_LOCAL_STORAGE_SECRET_KEY;

export class Encryption {
	static encrypt(data) {
		return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
	}

	static decrypt(data) {
		const decrypted = CryptoJS.AES.decrypt(data, SECRET_KEY).toString(
			CryptoJS.enc.Utf8
		);
		return JSON.parse(decrypted);
	}
}
