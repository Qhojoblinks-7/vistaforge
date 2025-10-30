// GraphQL API service for communicating with Django backend
const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:8000/graphql/';

class GraphQLService {
    constructor() {
        this.graphqlURL = GRAPHQL_URL;
    }

    async request(query, variables = {}, options = {}) {
        const token = localStorage.getItem('adminToken');

        const config = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `JWT ${token}` }),
                ...options.headers,
            },
            body: JSON.stringify({
                query,
                variables,
            }),
            ...options,
        };

        try {
            const response = await fetch(this.graphqlURL, config);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('HTTP Error Response:', errorText);
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            console.log('GraphQL Response:', result);

            if (result.errors) {
                console.error('GraphQL Errors:', result.errors);
                throw new Error(result.errors[0].message);
            }

            return result.data;
        } catch (error) {
            console.error('GraphQL request failed:', error);
            throw error;
        }
    }

    // Projects GraphQL API
    async getProjects(params = {}) {
        console.log('GraphQL Service: Fetching projects with params:', params);

        // For public access, use allPublicProjects query
        const query = `
            query GetPublicProjects {
                allProjects {
                    id
                    name
                    slug
                    intro
                    createdAt
                }
            }
        `;

        const result = await this.request(query);
        console.log('GraphQL Service: Projects response:', result);
        return result.allProjects;
    }

    async getProject(slug) {
        // For public access, we need to check if project is active
        // Since the backend filters by is_active=True for unauthenticated users,
        // this should work for public viewing
        const query = `
            query GetProject($slug: String!) {
                project(slug: $slug) {
                    id
                    name
                    slug
                    intro
                    createdAt
                }
            }
        `;

        const result = await this.request(query, { slug });
        return result.project;
    }

    async getFeaturedProjects() {
        // For public access, use allPublicProjects but limit to first 3
        const query = `
            query GetFeaturedProjects {
                allProjects {
                    id
                    name
                    slug
                    intro
                    createdAt
                }
            }
        `;

        const result = await this.request(query);
        // Return first 3 projects as featured
        return result.allProjects.slice(0, 3);
    }

    async getDesignProjects() {
        // For public access, filter design projects from allPublicProjects
        const query = `
            query GetDesignProjects {
                allProjects {
                    id
                    name
                    slug
                    intro
                    createdAt
                }
            }
        `;

        const result = await this.request(query);
        // Note: Since we simplified the public type, we can't filter by design tools here
        // This would need to be handled on the backend if design project filtering is needed
        return result.allProjects;
    }

    // Authentication GraphQL API
    async login(credentials) {
        const mutation = `
            mutation TokenAuth($username: String!, $password: String!) {
                tokenAuth(username: $username, password: $password) {
                    token
                    refreshToken
                    user {
                        id
                        username
                        email
                        isSuperuser
                    }
                }
            }
        `;

        const result = await this.request(mutation, credentials);

        // Store the token if login successful
        if (result.tokenAuth.token) {
            localStorage.setItem('adminToken', result.tokenAuth.token);
            localStorage.setItem('adminRefreshToken', result.tokenAuth.refreshToken);
        }

        return result.tokenAuth;
    }

    async logout() {
        // Clear tokens on logout
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminRefreshToken');
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminLoginTime');
        return { success: true };
    }

    async refreshToken() {
        const refreshToken = localStorage.getItem('adminRefreshToken');
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const mutation = `
            mutation RefreshToken($refreshToken: String!) {
                refreshToken(refreshToken: $refreshToken) {
                    token
                    refreshToken
                    payload
                }
            }
        `;

        const result = await this.request(mutation, { refreshToken });

        // Update stored tokens
        if (result.refreshToken.token) {
            localStorage.setItem('adminToken', result.refreshToken.token);
            localStorage.setItem('adminRefreshToken', result.refreshToken.refreshToken);
        }

        return result.refreshToken;
    }

    // Contact GraphQL API
    async submitContact(formData) {
        const mutation = `
            mutation SubmitContact($name: String!, $email: String!, $message: String!) {
                submitContact(name: $name, email: $email, message: $message) {
                    contactSubmission {
                        id
                        name
                        email
                        message
                        submittedAt
                    }
                }
            }
        `;

        const result = await this.request(mutation, formData);
        return result.submitContact.contactSubmission;
    }

    // Admin-only queries (require superuser authentication)
    async getAllContacts() {
        const query = `
            query GetAllContacts {
                allContacts {
                    id
                    name
                    email
                    message
                    submittedAt
                }
            }
        `;

        const result = await this.request(query);
        return result.allContacts;
    }

    async getUnreadContacts() {
        // Note: The private query doesn't have an unread filter, so we get all and filter client-side
        const query = `
            query GetAllContacts {
                allContacts {
                    id
                    name
                    email
                    message
                    submittedAt
                }
            }
        `;

        const result = await this.request(query);
        // Since we simplified the type, we can't filter by is_read here
        // This would need to be handled on the backend if unread filtering is needed
        return result.allContacts;
    }

    async getMe() {
        const query = `
            query GetMe {
                me {
                    id
                    username
                    email
                    isSuperuser
                }
            }
        `;

        const result = await this.request(query);
        return result.me;
    }
}

// Create and export a singleton instance
const graphQLService = new GraphQLService();
export default graphQLService;