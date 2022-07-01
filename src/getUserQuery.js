import { gql } from '@apollo/client';



export const getUser = gql`
query ExampleQuery($personEmail: String, $personName: String ) {
    people(where: { email:$personEmail , OR:{name: $personName }}) {
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

        previousWorkConnection {
        edges {
            node {
            companyName
            }
            role
            description
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
            }
            }

        }
        }
        skills {
        name
        description
        category {
            type
            value
        }
        }

        certs {
        name
        description
        category
        }


    }
    }
`