import random
from dataclasses import dataclass
from typing import List, Tuple

# -----------------------------
# Sample Data
# -----------------------------

@dataclass
class Course:
    course_id: str
    name: str
    course_lec: int
    course_lab: int
    room_type: str
    day: str
    time_start: str
    time_end: str
    section: str

@dataclass
class Instructor:
    instructor_id: str
    name: str
    max_lec_minutes: int
    max_lab_minutes: int

# Sample courses
courses = [
    Course("C101","Data Structures",2,0,"Lecture","Monday","08:00","09:30","BSIT-2A"),
    Course("C102","OOP Lab",0,1,"Laboratory","Monday","09:30","11:30","BSIT-2A"),
    Course("C103","Database Systems",2,0,"Lecture","Tuesday","13:00","14:30","BSIT-3A"),
    Course("C104","Networks Lab",0,2,"Laboratory","Wednesday","10:00","12:00","BSIT-3A"),
    Course("C105","Calculus",2,0,"Lecture","Thursday","08:00","09:30","BSIT-1A"),
]

# Sample instructors
instructors = [
    Instructor("I1","Alice Santos",180,240),
    Instructor("I2","Ben Cruz",360,300),
    Instructor("I3","Cara Dizon",270,300),
]

# -----------------------------
# Helpers
# -----------------------------

def to_minutes(hhmm: str) -> int:
    h, m = map(int, hhmm.split(":"))
    return h*60 + m

def overlap(s1, e1, s2, e2) -> bool:
    return max(s1, s2) < min(e1, e2)

def get_required_minutes(course: Course) -> int:
    """Apply equivalence rules: Lecture 2u=180min, Lab 1u=120min"""
    if course.room_type == "Laboratory":
        return course.course_lab * 120
    else:  # Lecture
        return course.course_lec * 90  # 2u = 180 min

# -----------------------------
# GA Representation
# -----------------------------

N_COURSES = len(courses)
N_INSTRUCTORS = len(instructors)

def initial_individual() -> List[int]:
    """Random assignment of courses to instructors"""
    return [random.randrange(N_INSTRUCTORS) for _ in range(N_COURSES)]

def mutate(ind, pmut=0.1):
    for i in range(len(ind)):
        if random.random() < pmut:
            ind[i] = random.randrange(N_INSTRUCTORS)

def crossover(p1, p2) -> Tuple[List[int], List[int]]:
    cut = random.randrange(1, len(p1))
    return p1[:cut]+p2[cut:], p2[:cut]+p1[cut:]

# -----------------------------
# Fitness Function
# -----------------------------

def fitness(ind) -> float:
    penalty = 0
    lec_used = [0]*N_INSTRUCTORS
    lab_used = [0]*N_INSTRUCTORS

    # Assign loads
    for ci, inst_idx in enumerate(ind):
        c = courses[ci]
        mins = get_required_minutes(c)
        if c.room_type == "Laboratory":
            lab_used[inst_idx] += mins
        else:
            lec_used[inst_idx] += mins

    # Penalize overloads
    for i, inst in enumerate(instructors):
        if lec_used[i] > inst.max_lec_minutes:
            penalty += (lec_used[i]-inst.max_lec_minutes)*5
        if lab_used[i] > inst.max_lab_minutes:
            penalty += (lab_used[i]-inst.max_lab_minutes)*5

    # Simple balance penalty (variance of total load)
    total = [lec_used[i]+lab_used[i] for i in range(N_INSTRUCTORS)]
    mean = sum(total)/len(total)
    penalty += sum((x-mean)**2 for x in total)

    return penalty

# -----------------------------
# GA Loop
# -----------------------------

def evolve(pop_size=30, generations=100, cxp=0.8, pmut=0.1):
    population = [initial_individual() for _ in range(pop_size)]
    best = min(population, key=fitness)
    best_fit = fitness(best)

    for g in range(generations):
        new_pop = []
        while len(new_pop) < pop_size:
            p1, p2 = random.choice(population), random.choice(population)
            if random.random() < cxp:
                c1, c2 = crossover(p1, p2)
            else:
                c1, c2 = p1[:], p2[:]
            mutate(c1, pmut)
            mutate(c2, pmut)
            new_pop.extend([c1, c2])
        population = new_pop[:pop_size]

        current_best = min(population, key=fitness)
        current_fit = fitness(current_best)
        if current_fit < best_fit:
            best, best_fit = current_best, current_fit

    return best, best_fit

# -----------------------------
# Run GA
# -----------------------------

best, best_fit = evolve()
print("Best fitness:", best_fit)

print("\nAssignments:")
for ci, inst_idx in enumerate(best):
    print(f"{courses[ci].name:20} -> {instructors[inst_idx].name}")
