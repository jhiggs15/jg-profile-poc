import { gql } from '@apollo/client';

export const getUser = gql`
query ExampleQuery($where: PersonWhere) {
    people(where: $where) {
        name
        email
        tense_title
        biography

        attendedConnection {
        edges {
            node {
            educationName
            }
            degreeName
            majorName
            startDate
            endDate
        }
        }
        nonJGProjects {
        projectFullName
        usesSkillConnection {
            edges {
            rating
            node {
                name
              category(where: {type: "Category"}) {
                value
              }
            }
            }

        }
        }
        certs {
        name
        description
        category
        }
      skillsConnection {
        edges {
          node {
            name
            description
            imageLink
            category(where: {type: "Category"}) {
              value
            }
          }
          rating
        }
      }
      previousWork {
        companyName
        usesSkillConnection {
          edges {
            node {
              name
              category(where: {type: "Category"}) {
                value
              }
            }
            rating
          }
        }
        employeeConnection {
          edges {
            description
            location
            startDate
            endDate
            sector
            role
          }
        }
      }
    }
}
`