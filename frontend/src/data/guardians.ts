export type GuardianRecord = {
  id: string
  name: string
  addedOn: string
  email: string
  phone: string
  avatar: string
  child: {
    name: string
    classLabel: string
    section: string
    avatar: string
  }
}

export const guardianRecords: GuardianRecord[] = [
  {
    id: 'G124545',
    name: 'Avila',
    addedOn: '01 Dec 2023',
    email: 'avila@example.com',
    phone: '+1 65738 58937',
    avatar: '/assets/img/parents/parent-12.jpg',
    child: {
      name: 'Janet',
      classLabel: 'III',
      section: 'A',
      avatar: '/assets/img/students/student-04.jpg',
    },
  },
  {
    id: 'G124553',
    name: 'Claudia',
    addedOn: '27 Feb 2024',
    email: 'claudia@example.com',
    phone: '+1 65738 58937',
    avatar: '/assets/img/parents/parent-04.jpg',
    child: {
      name: 'Richard',
      classLabel: 'IV',
      section: 'B',
      avatar: '/assets/img/students/student-12.jpg',
    },
  },
  {
    id: 'G124549',
    name: 'Jessie',
    addedOn: '08 Jan 2024',
    email: 'jessie@example.com',
    phone: '+1 65738 58937',
    avatar: '/assets/img/parents/parent-08.jpg',
    child: {
      name: 'Kathleen',
      classLabel: 'III',
      section: 'A',
      avatar: '/assets/img/students/student-03.jpg',
    },
  },
  {
    id: 'G124546',
    name: 'William',
    addedOn: '23 Dec 2023',
    email: 'william@example.com',
    phone: '+1 65738 58937',
    avatar: '/assets/img/parents/parent-09.jpg',
    child: {
      name: 'Lisa',
      classLabel: 'II',
      section: 'B',
      avatar: '/assets/img/students/student-04.jpg',
    },
  },
  {
    id: 'G124544',
    name: 'Stacey',
    addedOn: '10 Nov 2023',
    email: 'stacey@example.com',
    phone: '+1 65738 58937',
    avatar: '/assets/img/parents/parent-10.jpg',
    child: {
      name: 'Ralph',
      classLabel: 'II',
      section: 'B',
      avatar: '/assets/img/students/student-05.jpg',
    },
  },
  {
    id: 'G124543',
    name: 'George',
    addedOn: '04 Oct 2023',
    email: 'george@example.com',
    phone: '+1 65738 58937',
    avatar: '/assets/img/parents/parent-11.jpg',
    child: {
      name: 'Clara',
      classLabel: 'V',
      section: 'C',
      avatar: '/assets/img/students/student-06.jpg',
    },
  },
]

