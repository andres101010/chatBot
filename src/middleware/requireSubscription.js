export const requireSubscription = (requiredPlan) => {
  return async (req, res, next) => {
    try {

      const subscription = await Subscription.findOne({
        userId: req.user.id,
        status: "active"
      });

      if (!subscription) {
        return res.status(403).json({
          message: "El usuario no tiene una suscripción activa"
        });
      }

      const plans = {
        free: 0,
        basic: 1,
        pro: 2,
        enterprise: 3
      };

      if (plans[subscription.plan] < plans[requiredPlan]) {
        return res.status(403).json({
          message: "Tu plan no permite realizar esta acción"
        });
      }

      req.subscription = subscription;

      next();

    } catch (error) {
      return res.status(500).json({
        message: "Error verificando suscripción"
      });
    }
  };
};