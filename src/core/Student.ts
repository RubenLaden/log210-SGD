import Multimap = require('multimap');
import md5 = require('md5');
import { Course } from './Course';

export class Student {
    private _id: number = 0;
    private _first_name: string;
    private _last_name: string;
    private _email: string;
    private _permanent_code: string;

    static login(email: string, password: string) {
        let students = require('../data/students.json');
        for (const student of students) {
            if (student.email == email) {
                return md5(email);
            }
        }
        return null;
    }

    static loginV2(email: string, password: string) {
        let students = require('../data/students.json');
        for (const student of students) {
            if (student.email == email) {
                student.password = '';
                return [md5(email), student];
            }
        }
        return null;
    }
    static fromId(id: number) {
        let students = require('../data/students.json');
        for (const student of students) {
            if (student.id == id) {
                return new this(
                    student.id,
                    student.first_name,
                    student.last_name,
                    student.email,
                    student.permanent_code
                );
            }
        }
        throw new Error('Student id not found');
    }

    static fromToken(token: string) {
        let students = require('../data/students.json');
        for (const student of students) {
            if (md5(student.email) === token) {
                return new this(
                    student.id,
                    student.first_name,
                    student.last_name,
                    student.email,
                    student.permanent_code
                );
            }
        }
        throw new Error('Student token not found');
    }

    constructor(
        id: number,
        first_name: string,
        last_name: string,
        email: string,
        permanent_code: string
    ) {
        this._id = id;
        this._first_name = first_name;
        this._last_name = last_name;
        this._email = email;
        this._permanent_code = permanent_code;
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
    // public token(){
    //   return md5(this._email);
    // }

    public permanent_code() {
        return this._permanent_code;
    }

    public followCourse(course_id: number) {
        let courses = this.courses();
        for (const course of courses) {
            if (course.id() == course_id) return true;
        }
        return false;
    }
    public courses() {
        let course_students = require('../data/course_student.json');
        let _courses = [];
        for (const course_student of course_students) {
            if (this.id() == course_student.student_id) {
                _courses.push(Course.fromId(course_student.course_id));
            }
        }
        return _courses;
    }
}
