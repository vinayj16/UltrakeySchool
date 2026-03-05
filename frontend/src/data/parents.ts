export type ParentRecord = {
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

export const parentRecords: ParentRecord[] = [
  {
    id: 'P124556',
    name: 'Thomas',
    addedOn: '25 Mar 2024',
    email: 'thomas@example.com',
    phone: '+1 65738 58937',
    avatar: '/assets/img/parents/parent-01.jpg',
    child: {
      name: 'Janet',
      classLabel: 'III',
      section: 'A',
      avatar: '/assets/img/students/student-01.jpg',
    },
  },
  {
    id: 'P124555',
    name: 'Marquita',
    addedOn: '18 Mar 2024',
    email: 'marquita@example.com',
    phone: '+1 65738 58937',
    avatar: '/assets/img/parents/parent-02.jpg',
    child: {
      name: 'Joann',
      classLabel: 'IV',
      section: 'B',
      avatar: '/assets/img/students/student-02.jpg',
    },
  },
  {
    id: 'P124554',
    name: 'Johnson',
    addedOn: '14 Mar 2024',
    email: 'johnson@example.com',
    phone: '+1 65738 58937',
    avatar: '/assets/img/parents/parent-03.jpg',
    child: {
      name: 'Kathleen',
      classLabel: 'III',
      section: 'A',
      avatar: '/assets/img/students/student-03.jpg',
    },
  },
  {
    id: 'P124553',
    name: 'Marjorie',
    addedOn: '08 Mar 2024',
    email: 'marjorie@example.com',
    phone: '+1 65738 58937',
    avatar: '/assets/img/parents/parent-04.jpg',
    child: {
      name: 'Lisa',
      classLabel: 'II',
      section: 'B',
      avatar: '/assets/img/students/student-04.jpg',
    },
  },
  {
    id: 'P124552',
    name: 'Larry',
    addedOn: '02 Mar 2024',
    email: 'larry@example.com',
    phone: '+1 65738 58937',
    avatar: '/assets/img/parents/parent-05.jpg',
    child: {
      name: 'Ralph',
      classLabel: 'II',
      section: 'B',
      avatar: '/assets/img/students/student-05.jpg',
    },
  },
  {
    id: 'P124551',
    name: 'Dianne',
    addedOn: '25 Feb 2024',
    email: 'dianne@example.com',
    phone: '+1 65738 58937',
    avatar: '/assets/img/parents/parent-06.jpg',
    child: {
      name: 'Clara',
      classLabel: 'V',
      section: 'C',
      avatar: '/assets/img/students/student-06.jpg',
    },
  },
]

