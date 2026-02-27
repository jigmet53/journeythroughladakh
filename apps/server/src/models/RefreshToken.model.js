const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true
  },
  revoked: {
    type: Boolean,
    default: false,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Track device for security monitoring
  deviceInfo: {
    userAgent: String,
    ip: String
  }
});

// Compound index for efficient queries
refreshTokenSchema.index({ user: 1, revoked: 1, expiresAt: 1 });

// Auto-delete expired tokens after they expire
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Static method to cleanup old tokens
refreshTokenSchema.statics.cleanupExpiredTokens = async function() {
  return this.deleteMany({ expiresAt: { $lt: new Date() } });
};

// Static method to revoke all tokens for a user
refreshTokenSchema.statics.revokeAllUserTokens = async function(userId) {
  return this.updateMany(
    { user: userId, revoked: false },
    { revoked: true }
  );
};

const RefreshTokenModel = mongoose.model('RefreshToken', refreshTokenSchema);

module.exports = { RefreshTokenModel };
