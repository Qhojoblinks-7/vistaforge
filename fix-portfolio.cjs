const fs = require('fs');
const path = 'C:/Users/imman/Desktop/WebApps/VistaForge/src/pages/PortfolioPage.jsx';
let content = fs.readFileSync(path, 'utf8');

const oldStr = `          })}
        </script>
      </Helmet>`;

const newStr = `          })}
        </script>

        {/* Portfolio ItemList with CreativeWork/Project schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "VistaForge Portfolio Projects",
            "description": "Collection of brand design, web development, and UI/UX projects by VistaForge creative agency",
            "numberOfItems": sourceProjects.length,
            "itemListElement": sourceProjects.map((project, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": ["CreativeWork", "Project"],
                "@id": "https://vistaforge.com/case-studies/" + project.slug,
                "name": project.name || project.title,
                "description": project.intro,
                "image": project.heroImage || project.logo,
                "url": "https://vistaforge.com/case-studies/" + project.slug,
                "author": {
                  "@type": "Organization",
                  "name": "VistaForge",
                  "url": "https://vistaforge.com"
                },
                "publisher": {
                  "@type": "Organization",
                  "name": "VistaForge",
                  "url": "https://vistaforge.com"
                },
                "datePublished": project.createdAt,
                "dateModified": project.updatedAt || project.createdAt,
                "about": [
                  {
                    "@type": "Thing",
                    "name": project.industry || "Brand Design"
                  },
                  {
                    "@type": "Thing",
                    "name": project.clientType || "Business"
                  }
                ],
                "keywords": project.designTools?.join(", ") || "brand design, case study",
                "genre": "Case Study",
                "isPartOf": {
                  "@type": "CreativeWork",
                  "name": "VistaForge Portfolio"
                }
              }
            }))
          })}
        </script>
      </Helmet>`;

if (content.includes(oldStr)) {
  content = content.replace(oldStr, newStr);
  fs.writeFileSync(path, content, 'utf8');
  console.log('Replacement successful!');
} else {
  console.log('Old string not found. Trying with CRLF...');
  const oldStr2 = oldStr.replace(/\n/g, '\r\n');
  if (content.includes(oldStr2)) {
    content = content.replace(oldStr2, newStr.replace(/\n/g, '\r\n'));
    fs.writeFileSync(path, content, 'utf8');
    console.log('Replacement successful with CRLF!');
  } else {
    console.log('Still not found. The exact bytes:');
    console.log(JSON.stringify(oldStr));
  }
}