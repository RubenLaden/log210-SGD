import Multimap = require('multimap');
import md5 = require('md5');
import { Course } from './Course';

export class Teacher {
    private _id: number = 0;
    private _first_name: string;
    private _last_name: string;
    private _email: string;

    static login(email: string, password: string) {
        let teachers = require('../data/teachers.json');
        for (const teacher of teachers) {
            if (teacher.email == email) {
                return md5(email);
            }
        }
        return null;
    }

    static loginV2(email: string, password: string) {
        let teachers = require('../data/teachers.json');
        for (const teacher of teachers) {
            if (teacher.email == email) {
                teacher.password = '';
                return [md5(email), teacher];
            }
        }
        return null;
    }

    static fromId(id: number) {
        let teachers = require('../data/teachers.json');
        for (const teacher of teachers) {
            if (teacher.id == id) {
                return new this(
                    teacher.id,
                    teacher.first_name,
                    teacher.last_name,
                    teacher.email
                );
            }
        }
        throw new Error('Teacher id not found');
    }

    static fromToken(token: string) {
        let teachers = require('../data/teachers.json');
        for (const teacher of teachers) {
            if (md5(teacher.email) == token) {
                return new this(
                    teacher.id,
                    teacher.first_name,
                    teacher.last_name,
                    teacher.email
                );
            }
        }
        throw new Error('Teacher token not found');
    }
    constructor(
        id: number,
        first_name: string,
        last_name: string,
        email: string
    ) {
        this._id = id;
        this._first_name = first_name;
        this._last_name = last_name;
        this._email = email;
    }

    public id() {
        return this._id;
    }

    public name() {
        return this._first_name + ' ' + this._last_name;
    }

    public email() {
        return this._email;
    }
    public giveCourse(course_id: number) {
        let courses = this.courses();
        for (const course of courses) {
            if (course.id() == course_id) return true;
        }
        return false;
    }
    // public token(){
    //   return md5(this._email);
    // }

    public courses() {
        let course_teachers = require('../data/course_teacher.json');
        let _courses = [];
        for (const course_teacher of course_teachers) {
            if (this.id() == course_teacher.teacher_id) {
                _courses.push(Course.fromId(course_teacher.course_id));
            }
        }
        return _courses;
    }
}
