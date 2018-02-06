import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import moment from 'moment-timezone';

export default PostsSchema = new SimpleSchema({
  userId: {
    type: String,
    autoform: {
      type: 'hidden',
      label: false
    },
    autoValue: function() {
      if (this.isSet || this.isUpdate)
        return this.value;
      else
        return Meteor.userId();
    }
  },
  author: {
    type: String,
    autoform: {
      type: 'hidden',
      label: false
    },
    autoValue: function() {
      if (this.isSet || this.isUpdate)
        return this.value;
      else
        return Meteor.user().username;
    }
  },
  photo: scorpius.attribute('image', {
    label: 'Image',
    optional: true
  }),
  submitted: {
    type: Date,
    autoform: {
      type: 'hidden',
      label: false
    },
    defaultValue: moment(new Date()).tz("Pacific/Honolulu").toDate()
  },
  title: {
    type: String,
    label: 'Title',
    optional: false,
    max: 80
  },
  tags: {
    type: [String],
    optional: true
  },
  category: {
    type: String,
    optional: false,
    defaultValue: 'Radioblog'
  },
  summary: {
    type: String,
    label: 'Summary',
    optional: true,
    autoform: {
      type: 'textarea',
      rows: 3
    }
  },
  body: scorpius.attribute('summernote', {
    type: String,
    label: 'Body',
    optional: false
  }),
  slug: {
    type: String,
    autoform: {
      type: 'hidden',
      label: false
    }
  },
  commentCount: {
    type: Number,
    label: 'Comment Count',
    defaultValue: 0,
    autoform: {
      type: 'hidden',
      label: false
    }
  },
  featured: {
    type: Boolean,
    optional: true,
    defaultValue: false,
    label: 'Featured'
  },
  approved: {
    type: Boolean,
    optional: true,
    defaultValue: false,
    label: 'Approved'
  }
});
