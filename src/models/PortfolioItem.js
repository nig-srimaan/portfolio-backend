import mongoose from 'mongoose';

const portfolioItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Projects', 'Internships', 'Certifications'],
      default: 'Projects',
    },
    skills: {
      type: [String],
      required: [true, 'At least one skill is required'],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'Skills array cannot be empty',
      },
    },
    whatILearned: {
      type: String,
      required: [true, 'What I Learned field is required'],
      trim: true,
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
