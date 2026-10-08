import type { CertificateGroup } from '../types/portfolio';

export const certificateGroups: readonly CertificateGroup[] = [
  {
    id: 'degree',
    title: 'BSc Honours Degree',
    status: 'Completed 2021',
    description: 'Geography and Environmental Sciences from NWU Vaal.',
    records: [
      {
        id: 'bsc-honours-degree', category: 'degree', title: 'BSc Honours Degree',
        legacyPath: 'certificates/BSc%20Honours%20Degree%20-%20Ruan%20Coetzee%20.pdf',
        href: new URL('../../certificates/BSc Honours Degree - Ruan Coetzee .pdf', import.meta.url).href,
      },
    ],
  },
  {
    id: 'ai-engineering',
    title: 'AI Engineering',
    status: 'In Progress',
    description: 'Currently pursuing advanced studies in AI Engineering.',
    records: [
      {
        id: 'introduction-to-ai', category: 'ai-engineering', title: 'Introduction to AI',
        legacyPath: 'certificates\\AI Engineering Certificates/Introduction%20to%20AI%20-%20Ruan%20Coetzee%20(Coursera%20JZZVO26QGVZ3).pdf',
        href: new URL('../../certificates/AI Engineering Certificates/Introduction to AI - Ruan Coetzee (Coursera JZZVO26QGVZ3).pdf', import.meta.url).href,
      },
      {
        id: 'generative-ai-introduction-applications', category: 'ai-engineering', title: 'Generative AI: Intro & Applications',
        legacyPath: 'certificates\\AI Engineering Certificates/Introduction%20&%20Applications%20-%20Ruan%20Coetzee.pdf',
        href: new URL('../../certificates/AI Engineering Certificates/Introduction & Applications - Ruan Coetzee.pdf', import.meta.url).href,
      },
      {
        id: 'prompt-engineering-basics', category: 'ai-engineering', title: 'Prompt Engineering Basics',
        legacyPath: 'certificates\\AI Engineering Certificates/Prompt%20Engineering%20Basics%20-%20Ruan%20Coetzee.pdf',
        href: new URL('../../certificates/AI Engineering Certificates/Prompt Engineering Basics - Ruan Coetzee.pdf', import.meta.url).href,
      },
      {
        id: 'python-data-science-ai-development', category: 'ai-engineering', title: 'Python for Data Science, AI & Development',
        legacyPath: 'certificates\\AI Engineering Certificates/Python%20for%20Data%20Science,%20AI%20&%20Development%20-%20Ruan%20Coetzee.pdf',
        href: new URL('../../certificates/AI Engineering Certificates/Python for Data Science, AI & Development - Ruan Coetzee.pdf', import.meta.url).href,
      },
      {
        id: 'python-flask-app-development', category: 'ai-engineering', title: 'Python & Flask App Development',
        legacyPath: 'certificates\\AI Engineering Certificates/Developing%20AI%20Applications%20with%20Python%20and%20Flask%20-%20Ruan%20Coetzee%20(Coursera).pdf',
        href: new URL('../../certificates/AI Engineering Certificates/Developing AI Applications with Python and Flask - Ruan Coetzee (Coursera).pdf', import.meta.url).href,
      },
    ],
  },
  {
    id: 'web-development-sql',
    title: 'Web Development & SQL',
    status: 'Completed Courses',
    description: 'Foundational and advanced training in web technologies and database management.',
    records: [
      {
        id: 'html-css-beginners', category: 'web-development-sql', title: 'HTML and CSS for Beginners',
        legacyPath: 'certificates/Web Development Certificates/HTML%20and%20CSS%20for%20Beginners%20-%20Build%20a%20Website%20&%20Launch%20Online%20(Ruan%20Coetzee).pdf',
        href: new URL('../../certificates/Web Development Certificates/HTML and CSS for Beginners - Build a Website & Launch Online (Ruan Coetzee).pdf', import.meta.url).href,
      },
      {
        id: 'complete-sql-bootcamp-2022', category: 'web-development-sql', title: 'Complete SQL Bootcamp 2022',
        legacyPath: 'certificates/Web Development Certificates/Ruan%20Coetzee%20-%20Complete%20SQL%20Bootcamp%202022%20Certificate.pdf',
        href: new URL('../../certificates/Web Development Certificates/Ruan Coetzee - Complete SQL Bootcamp 2022 Certificate.pdf', import.meta.url).href,
      },
      {
        id: 'mimo-sql-certificate', category: 'web-development-sql', title: 'Mimo SQL Certificate',
        legacyPath: 'certificates/Web%20Development%20Certificates/Ruan%20Coetzee_s%20Mimo%20SQL%20certificate.pdf',
        href: new URL('../../certificates/Web Development Certificates/Ruan Coetzee_s Mimo SQL certificate.pdf', import.meta.url).href,
      },
      {
        id: 'mimo-web-development-certificate', category: 'web-development-sql', title: 'Mimo Web Development Certificate',
        legacyPath: 'certificates/Web%20Development%20Certificates/Ruan%20Coetzee_s%20Web%20Development-Mimo-certificate.pdf',
        href: new URL('../../certificates/Web Development Certificates/Ruan Coetzee_s Web Development-Mimo-certificate.pdf', import.meta.url).href,
      },
    ],
  },
];
