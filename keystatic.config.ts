import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: import.meta.env.PROD
    ? {
      kind: 'github',
      repo: 'mk-162/psyc-direct',
    }
    : {
      kind: 'local',
    },

  collections: {
    // Service Pages (Psychology & Psychiatry)
    pages: collection({
      label: 'Service Pages',
      slugField: 'title',
      path: 'src/content/pages/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({
          name: {
            label: 'Page Title',
            description: 'Main H1 heading for the page',
          },
        }),
        seoTitle: fields.text({
          label: 'SEO Title',
          description: 'Title tag for search engines (60 chars max)',
          validation: { length: { max: 60 } },
        }),
        metaDescription: fields.text({
          label: 'Meta Description',
          description: 'Description for search results (155 chars max)',
          validation: { length: { max: 155 } },
          multiline: true,
        }),
        category: fields.select({
          label: 'Service Category',
          options: [
            { label: 'Expert Witness Psychology', value: 'expert-witness-psychology' },
            { label: 'Expert Witness Psychiatry', value: 'expert-witness-psychiatry' },
            { label: 'Educational Psychology', value: 'educational-psychology' },
            { label: 'Clinical Psychology', value: 'clinical-psychology' },
          ],
          defaultValue: 'expert-witness-psychology',
        }),
        hero: fields.object({
          badge: fields.text({
            label: 'Hero Badge',
            defaultValue: 'Expert Witness Psychology',
          }),
          title: fields.text({
            label: 'Hero Title',
            description: 'Large heading in hero section',
          }),
          subtitle: fields.text({
            label: 'Hero Subtitle',
            description: 'Supporting text below hero title',
            multiline: true,
          }),
        }),
        challenge: fields.object({
          title: fields.text({
            label: 'Challenge Section Title',
            defaultValue: 'The Challenge',
          }),
          content: fields.markdoc({
            extension: 'md',
            label: 'Challenge Content',
            formatting: true,
            dividers: true,
            links: true,
            lists: true,
          }),
        }),
        solution: fields.object({
          title: fields.text({
            label: 'Solution Section Title',
            defaultValue: 'Our Solution',
          }),
          content: fields.markdoc({
            extension: 'md',
            label: 'Solution Content',
            formatting: true,
            dividers: true,
            links: true,
            lists: true,
          }),
        }),
        whyChooseUs: fields.array(
          fields.object({
            icon: fields.select({
              label: 'Icon',
              options: [
                { label: '⚖️ Legal', value: 'legal' },
                { label: '🎯 Target', value: 'target' },
                { label: '📋 Document', value: 'document' },
                { label: '👥 Team', value: 'team' },
                { label: '⏱️ Time', value: 'time' },
                { label: '✅ Check', value: 'check' },
                { label: '🔒 Security', value: 'security' },
                { label: '📊 Chart', value: 'chart' },
              ],
              defaultValue: 'check',
            }),
            title: fields.text({ label: 'Benefit Title' }),
            description: fields.text({
              label: 'Benefit Description',
              multiline: true,
            }),
          }),
          {
            label: 'Why Choose Us Benefits',
            itemLabel: (props) => props.fields.title.value || 'New Benefit',
          }
        ),
        faqs: fields.array(
          fields.object({
            question: fields.text({
              label: 'FAQ Question',
            }),
            answer: fields.markdoc({
              extension: 'md',
              label: 'FAQ Answer',
              formatting: true,
              links: true,
              lists: true,
            }),
          }),
          {
            label: 'FAQs',
            itemLabel: (props) => props.fields.question.value || 'New FAQ',
          }
        ),
        trustSignals: fields.object({
          stat1: fields.object({
            number: fields.text({ label: 'Statistic 1 Number', defaultValue: '500+' }),
            label: fields.text({ label: 'Statistic 1 Label', defaultValue: 'Reports Delivered' }),
          }),
          stat2: fields.object({
            number: fields.text({ label: 'Statistic 2 Number', defaultValue: '15+' }),
            label: fields.text({ label: 'Statistic 2 Label', defaultValue: 'Years Experience' }),
          }),
          stat3: fields.object({
            number: fields.text({ label: 'Statistic 3 Number', defaultValue: '100%' }),
            label: fields.text({ label: 'Statistic 3 Label', defaultValue: 'Court Accepted' }),
          }),
        }),
        content: fields.markdoc({
          extension: 'md',
          label: 'Additional Page Content',
          description: 'Optional additional content sections',
          formatting: true,
          dividers: true,
          links: true,
          lists: true,
          images: true,
        }),
      },
    }),

    // Blog Posts
    posts: collection({
      label: 'Blog Posts',
      path: 'src/content/posts/*',
      slugField: 'title',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({
          name: {
            label: 'Post Title',
          },
        }),
        coverImage: fields.image({
          label: 'Cover Image',
          directory: 'src/assets/images/blog/covers',
          publicPath: '@assets/images/blog/covers/',
        }),
        publishDate: fields.date({
          label: 'Publish Date',
          defaultValue: { kind: 'today' },
        }),
        author: fields.text({
          label: 'Author Name',
          defaultValue: 'Psychology Direct Team',
        }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Expert Witness', value: 'expert-witness' },
            { label: 'Family Law', value: 'family-law' },
            { label: 'Criminal Law', value: 'criminal-law' },
            { label: 'Prison Law', value: 'prison-law' },
            { label: 'Educational Psychology', value: 'educational-psychology' },
            { label: 'Mental Health', value: 'mental-health' },
            { label: 'Case Studies', value: 'case-studies' },
            { label: 'Industry News', value: 'industry-news' },
          ],
          defaultValue: 'expert-witness',
        }),
        excerpt: fields.text({
          label: 'Excerpt',
          description: 'Short summary for blog listings',
          multiline: true,
        }),
        seoTitle: fields.text({
          label: 'SEO Title',
          description: 'Title tag for search engines',
        }),
        metaDescription: fields.text({
          label: 'Meta Description',
          description: 'Description for search results',
          multiline: true,
        }),
        tags: fields.array(
          fields.text({ label: 'Tag' }),
          {
            label: 'Tags',
            itemLabel: (props) => props.value || 'New Tag',
          }
        ),
        draft: fields.checkbox({
          label: 'Draft',
          description: 'Check to save as draft (not published)',
          defaultValue: false,
        }),
        content: fields.markdoc({
          extension: 'md',
          label: 'Post Content',
          formatting: true,
          dividers: true,
          links: true,
          lists: true,
          images: {
            directory: 'src/assets/images/blog',
            publicPath: '@assets/images/blog/',
          },
        }),
      },
    }),

    // Team Members
    team: collection({
      label: 'Team Members',
      slugField: 'name',
      path: 'src/content/team/*',
      schema: {
        name: fields.slug({
          name: {
            label: 'Full Name',
          },
        }),
        title: fields.text({
          label: 'Job Title',
          description: 'e.g., Clinical Psychologist, Forensic Psychiatrist',
        }),
        qualifications: fields.text({
          label: 'Qualifications',
          description: 'e.g., HCPC Registered, PhD',
          multiline: true,
        }),
        photo: fields.image({
          label: 'Profile Photo',
          directory: 'src/assets/images/team',
          publicPath: '@assets/images/team/',
        }),
        bio: fields.markdoc({
          extension: 'md',
          label: 'Biography',
          formatting: true,
          links: true,
          lists: true,
        }),
        specializations: fields.array(
          fields.text({ label: 'Specialization' }),
          {
            label: 'Specializations',
            itemLabel: (props) => props.value || 'New Specialization',
          }
        ),
        yearsExperience: fields.number({
          label: 'Years of Experience',
          defaultValue: 10,
        }),
        email: fields.text({
          label: 'Email Address (optional)',
        }),
        linkedIn: fields.text({
          label: 'LinkedIn URL (optional)',
        }),
        displayOrder: fields.number({
          label: 'Display Order',
          description: 'Lower numbers appear first',
          defaultValue: 0,
        }),
      },
    }),
  },
});
