import mongoose from 'mongoose';

const portfolioItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: '',
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      enum: ['Projects', 'Internships', 'Certifications'],
      default: 'Projects',
    },
    skills: {
      type: [String],
      default: [],
    },
    whatILearned: {
      type: String,
      trim: true,
      default: '',
    },
    mediaUrls: {
      type: [String],
      default: [],
    },
    thumbnailUrl: {
      type: String,
      default: '',
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    currentlyWorking: {
    type: Boolean,
    default: false,
    },
    externalLink: {
      type: String,
      default: '',
    },
    githubLink: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

portfolioItemSchema.index({ category: 1 });
portfolioItemSchema.index({ skills: 1 });
portfolioItemSchema.index({ createdAt: -1 });

const PortfolioItem = mongoose.model('PortfolioItem', portfolioItemSchema);

export default PortfolioItem;
