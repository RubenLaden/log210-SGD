import { Router, Request, Response, NextFunction } from 'express';
import { SgbController } from '../core/SgbController';

export class SgbRouter {
    router: Router;
    controller: SgbController; // contrôleur GRASP
    router_latency: number;

    /**
     * Initialize the Router
     */
    constructor() {
        this.router_latency = 0;
        this.controller = new SgbController(); // init contrôleur GRASP
        this.router = Router();
        this.init();
    }

    /**
     * lister les cours
     */
    public async courses(req: Request, res: Response, next: NextFunction) {
        try {
            // Invoquer l'opération système (du DSS) dans le contrôleur GRASP
            let token = req.headers.token as string;
            // console.log("Token from header:", token);
            let courses = this.controller.courses(token);
            await this.generate_latency();
            res.status(200).send({
                message: 'Success',
                status: res.status,
                data: courses,
            });
        } catch (error) {
            let code = 500; // internal server error
            res.status(code).json({ error: error.toString() });
        }
    }

    public async students(req: Request, res: Response, next: NextFunction) {
        try {
            // Invoquer l'opération système (du DSS) dans le contrôleur GRASP
            let token = req.headers.token as string;
            let course = parseInt(req.params.course);
            let data = this.controller.students(token, course);
            await this.generate_latency();
            res.status(200).send({
                message: 'Success',
                status: res.status,
                data: data,
            });
        } catch (error) {
            //console.log(error)
            let code = 500; // internal server error
            res.status(code).json({ error: error.toString() });
        }
    }

    public async note(req: Request, res: Response, next: NextFunction) {
        try {
            // Invoquer l'opération système (du DSS) dans le contrôleur GRASP
            let teacher_token = req.headers.token as string;
            let data = this.controller.note(
                teacher_token,
                parseInt(req.query.student_id as string),
                parseInt(req.query.course_id as string),
                req.query.type as string,
                parseInt(req.query.type_id as string),
                parseFloat(req.query.note as string)
            );

            res.status(200).send({
                message: 'Success',
                status: res.status,
            });
        } catch (error) {
            let code = 500; // internal server error
            res.status(code).json({ error: error.toString() });
        }
    }

    public async studentNote(req: Request, res: Response, next: NextFunction) {
        try {
            // Invoquer l'opération système (du DSS) dans le contrôleur GRASP
            let data = this.controller.studentNote(
                req.headers.token as string,
                parseInt(req.query.course as string),
                req.query.type as string,
                parseInt(req.query.type_id as string),
                parseFloat(req.query.note as string)
            );
            await this.generate_latency();

            res.status(200).send({
                message: 'Success',
                status: res.status,
                data: data,
            });
        } catch (error) {
            let code = 500; // internal server error
            res.status(code).json({ error: error.toString() });
        }
    }

    public async studentNotes(req: Request, res: Response, next: NextFunction) {
        try {
            // Invoquer l'opération système (du DSS) dans le contrôleur GRASP
            let token = req.headers.token as string;
            let data = this.controller.studentNotes(token);
            let sortedData = data.sort((n1, n2) => n1.course - n2.course);
            await this.generate_latency();
            res.status(200).send({
                message: 'Success',
                status: res.status,
                data: sortedData,
            });
        } catch (error) {
            let code = 500; // internal server error
            res.status(code).json({ error: error.toString() });
        }
    }

    public async studentCourses(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            // Invoquer l'opération système (du DSS) dans le contrôleur GRASP
            let token = req.headers.token as string;
            let data = this.controller.studentCourses(token);

            await this.generate_latency();
            res.status(200).send({
                message: 'Success',
                status: res.status,
                data: data,
            });
        } catch (error) {
            let code = 500; // internal server error
            res.status(code).json({ error: error.toString() });
        }
    }

    public async courseNotes(req: Request, res: Response, next: NextFunction) {
        try {
            // Invoquer l'opération système (du DSS) dans le contrôleur GRASP
            let token = req.headers.token as string;
            let course = parseInt(req.params.course);
            // console.log("coursesNotes called with token", token, " and course ", course)
            let data = this.controller.courseNotes(token, course);
            await this.generate_latency();
            res.status(200).send({
                message: 'Success',
                status: res.status,
                data: data,
            });
        } catch (error) {
            let code = 500; // internal server error
            res.status(code).json({ error: error.toString() });
        }
    }
    public async login(req: Request, res: Response, next: NextFunction) {
        try {
            let email = req.query.email as string;
            let password = req.query.password as string;
            // Invoquer l'opération système (du DSS) dans le contrôleur GRASP
            let token = this.controller.login(email, password);

            await this.generate_latency();
            res.status(200).send({
                message: 'Success',
                status: res.status,
                token: token,
            });
        } catch (error) {
            let code = 500; // internal server error
            res.status(code).json({ error: error.toString() });
        }
    }

    public async clearNotes(req: Request, res: Response, next: NextFunction) {
        try {
            // Invoquer l'opération système (du DSS) dans le contrôleur GRASP
            let token = req.headers.token as string;
            this.controller.clearNotes(token);
            res.status(200).send({
                message: 'Success',
                status: res.status,
            });
        } catch (error) {
            let code = 500; // internal server error
            res.status(code).json({ error: error.toString() });
        }
    }

    public async latency(req: Request, res: Response, next: NextFunction) {
        this.router_latency = parseFloat(req.query.value as string); // Invoquer l'opération système (du DSS) dans le contrôleur GRASP
        // console.log("latency called with value of ", this.router_latency)
        await this.generate_latency();

        res.status(200).send({
            message: 'Success',
            status: res.status,
            data: this.router_latency,
        });
    }

    public async generate_latency() {
        let latency: number = this.router_latency;
        let random: number = Math.random();
        let delay: number = +(random * latency * 1000).toFixed();
        // console.log("Use a latency of", delay, ' milliseconds')
        await new Promise((resolve) => setTimeout(resolve, delay));
    }

    //apidoc -i src/routes/ -o docs/

    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init() {
        /**
         * @api {get} /v1/latency?value=latence  Latence
         * @apiDescription Ajuster la latence pour modifier la performance du serveur SGB.
         * @apiName GetUser
         * @apiGroup Test
         * @apiVersion 1.0.0
         *
         * @apiParam {float} latence valeur de la latence en secondes..
         *
         */
        this.router.get('/latency', this.latency.bind(this)); // pour .bind voir https://stackoverflow.com/a/15605064/1168342
        /**
         * @api {get} /v1/notes/clear Annuler la latence
         * @apiGroup Test
         * @apiDescription Effacter toutes les notes dans le serveur SGB.  Pour vous faciliter la tâche et ne pas avoir à redémarrer le serveur à chaque fois qu'on veut nettoyer les données.  Peut aussi être très utile pour la réalisation des tests automatisées.
         * @apiVersion 1.0.0
         */
        this.router.get('/notes/clear', this.clearNotes.bind(this)); // pour .bind voir https://stackoverflow.com/a/15605064/1168342
        /**
         * @api {get} /v1/login?email=email&password=password Login
         * @apiGroup Application
         * @apiDescription Authentification de l'usager et récupération du token d'authentification
         * @apiVersion 1.0.0
         *
         * @apiParam {String} email courriel de l'usager.  Vous devez encoder email avec https://www.w3schools.com/tags/ref_urlencode.ASP
         *
         * @apiSuccess (200) {String}  authentification token à mettre dans le header pour faire les autres requêtes.
         */
        this.router.get('/login', this.login.bind(this)); // pour .bind voir https://stackoverflow.com/a/15605064/1168342
        /**
         * @api {get} /v1/student/note?course=course&type=type&type_id=type_id&note=note Ajouter note étudiant
         * @apiGroup Etudiant
         * @apiDescription Ajout d'une note dans le dossier de l'étudiant
         * @apiVersion 1.0.0
         *
         * @apiParam {Integer} course id du cours.
         * @apiParam {String} type devoir ou Questionnaire
         * @apiParam {Integer} type_id id du devoir ou du questionnaire
         * @apiParam {Float}  note note de l'étudiant à enregistrer.
         *
         */

        this.router.get('/student/note', this.studentNote.bind(this)); // pour .bind voir https://stackoverflow.com/a/15605064/1168342

        /**
	 * @api {put} /v1/note?student_id=student_id&course_id=course_id&type=type&type_id=type_id&note=note Enseignant ajouter une note à un étudiant
	 * @apiGroup Enseignant
	 * @apiDescription L'enseignant ajoute une note dans le dossier de l'étudiant
	 * @apiVersion 1.0.0
	 *

	 * @apiParam {Integer} student_id id de l'étudiant.
	 * @apiParam {Integer} course_id id du cours.
	 * @apiParam {String} type devoir ou Questionnaire
	 * @apiParam {Integer} type_id id du devoir ou du questionnaire
	 * @apiParam {Float}  note note de l'étudiant à enregistrer.
	 *
	 */

        this.router.post('/note', this.note.bind(this)); // pour .bind voir https://stackoverflow.com/a/15605064/1168342

        /**
         * @api {get} /v1/student/notes Notes de l'étudiant
         * @apiGroup Etudiant
         * @apiDescription Récupération de toutes les notes d'un étudiant
         * @apiVersion 1.0.0
         *
         * @apiParam {String} token Authentification token dans le header.
         *
         *  @apiSuccess (200) {String} json [ { course: '1', type: 'devoir', type_id: '2', note: '33.33' },]
         */

        this.router.get('/student/notes', this.studentNotes.bind(this)); // pour .bind voir https://stackoverflow.com/a/15605064/1168342

        /**
	 * @api {get} /v1/student/courses Cours de l'étudiant
	 * @apiGroup Etudiant
	 * @apiDescription Récupération de tout les cours d'un étudiant
	 * @apiVersion 1.0.0
	 *
	 * @apiParam {String} token Authentification token dans le header.
	 *
	 *  @apiSuccess (200) {String} json [ { id: 5,
	    sigle: 'LOG430',
	    nb_max_student: 5,
	    groupe: '01',
	    titre: 'Architecture logicielle',
	    date_debut: '2019-09-03',
	    date_fin: '2019-09-03' },
		 ]
	 */

        this.router.get('/student/courses', this.studentCourses.bind(this)); // pour .bind voir https://stackoverflow.com/a/15605064/1168342

        /**
	 * @api {get} /v1/courses Cours de l'enseignant
	 * @apiGroup Enseignant
	 * @apiDescription Récupération de tous les cours enseigner par un enseignant
	 * @apiVersion 1.0.0
	 *
	 * @apiParam {String} token Authentification token dans le header.
	 *

	 *  @apiSuccess (200) {String} json [ { id: 3,
    sigle: 'LOG210',
    nb_max_student: 5,
    groupe: '03',
    titre: 'Analyse et conception de logiciels',
    date_debut: '2019-09-03',
    date_fin: '2019-11-03' }, ...]

	 */
        this.router.get('/courses', this.courses.bind(this)); // pour .bind voir https://stackoverflow.com/a/15605064/1168342

        /**
	 * @api {get} /v1/course/:course/notes Notes des étudiants
	 * @apiGroup Enseignant
	 * @apiDescription Récupération de toutes les notes des étudiants d'un cours
	 * @apiVersion 1.0.0
	 *
	 * @apiParam {String} token Authentification token dans le header.
   * @apiParam {Integer} :course id du cours .
	 *
	 *  @apiSuccess (200) {String} json [ { course: '2',
    type: 'questionnaire',
    type_id: '5',
    note: '66.66',
    student: '3' },]
	 */
        this.router.get('/course/:course/notes', this.courseNotes.bind(this)); // pour .bind voir https://stackoverflow.com/a/15605064/1168342

        /**
	 * @api {get} /v1/course/:course/students Étudiants inscrit à un cours
	 * @apiGroup Enseignant
	 * @apiDescription  Récupération de tous les étudiants inscrit a un cours
	 * @apiVersion 1.0.0
	 *
	 * @apiParam {String} token Token d'authentification de l'enseignant dans le header.
   * @apiParam {Integer} :course id du cours .
	 *
	 *  @apiSuccess (200) {String} json [ { id: 2,
    first_name: 'firstname2',
    last_name: 'last_name2',
    email: 'student+2@gmail.com',
    permanent_code: 'lastf2' },]
	 */

        this.router.get('/course/:course/students', this.students.bind(this)); // pour .bind voir https://stackoverflow.com/a/15605064/1168342
    }
}

// exporter its configured Express.Router
export const sgbRoutes = new SgbRouter();
sgbRoutes.init();
