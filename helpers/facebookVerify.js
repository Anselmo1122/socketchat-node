const facebookVerify = async (fb_token) => {
	try {
		// Crea un token de acceso de la aplicación.
		const { access_token } = await fetch(
			`https://graph.facebook.com/oauth/access_token?client_id=${process.env.META_ID_APP}&client_secret=${process.env.META_SECRETKEY_APP}&grant_type=client_credentials`
		)
			.then((res) => res.json())
			.then((res) => res);

		// Inspecciona los identficadores de acceso y devuelve información sobre si es válido.
		const { data } = await fetch(
			`https://graph.facebook.com/debug_token?input_token=${fb_token}&access_token=${access_token}`
		)
			.then((res) => res.json())
			.then((res) => res);

		if (!data.is_valid) throw new Error("Token no válido");

		const facebookUserVerified = fetch(
			`https://graph.facebook.com/${data.user_id}?fields=id,name,email,picture&access_token=${fb_token}`
		)
			.then((res) => res.json())
			.then((res) => res)
			.catch(console.warn);

		return facebookUserVerified;
	} catch (error) {
		throw new Error(error);
	}
};

module.exports = facebookVerify;
