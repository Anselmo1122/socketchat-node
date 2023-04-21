const validateRole = async (req, res, next) => {
	if (!req.user) {
		return res.status(500).json({
			message: "Estás validando el rol antes de verificar el token",
		});
	}
	if (req.user.role !== "ADMIN_ROLE") {
		return res.status(401).json({
			message:
				"Para realizar esta operación necesita permisos de administrador.",
		});
	}
	next();
};

const hasRole = (...roles) => {
	return (req, res, next) => {
		if (!req.user) {
			return res.status(500).json({
				message: "Estás validando el rol antes de verificar el token",
			});
		}
		if (!roles.includes(req.user.role)) {
			return res.status(401).json({
				message: `El usuario debe tener uno de estos roles: ${roles.join(
					", "
				)}`,
			});
		}
		next();
	};
};

module.exports = {
	validateRole,
	hasRole,
};
