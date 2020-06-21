<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Validator\Constraints as Assert;


/**
 * @ORM\Entity(repositoryClass="App\Repository\ProjectRepository")
 * 
 * @ORM\Table(name="`project`")
 * 
 * @ORM\HasLifecycleCallbacks()
 * @JMS\ExclusionPolicy("ALL")
 */
class Project
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * 
     * @JMS\Groups({"whoami", "get_project"})
     * @JMS\Expose()
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * 
     * @Assert\Length(
     *      min = 3,
     *      max = 254,
     * )
     * 
     * @JMS\Groups({"whoami", "get_project"})
     * @JMS\Expose()
     */
    private $name;

    /**
     *  @JMS\Groups({"get_project"})
     *  @JMS\MaxDepth(1)
     *  @JMS\Expose()
     *  @ORM\ManyToMany(targetEntity="App\Entity\User", inversedBy="projects")
     */
    private $users;

    /**
     * @ORM\Column(type="text", nullable=true)
     * 
     * @Assert\Length(
     *      min = 3,
     *      max = 5000,
     * )
     * @JMS\Groups({"get_project"})
     * @JMS\Expose()
     */
    private $description;

    /**
     * @ORM\Column(name="creation_date", type="datetime")
     * @ORM\Column(type="datetime")
     * @JMS\Groups({"get_project"})
     * @JMS\Expose()
     */
    private $creationDate;

    /**
     * @ORM\Column(name="modification_date", type="datetime")
     * @ORM\Column(type="datetime")
     * @JMS\Groups({"get_project"})
     * @JMS\Expose()
     */
    private $modificationDate;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Ticket", mappedBy="project", orphanRemoval=true)
     * @JMS\Groups({"get_project"})
     * @JMS\Expose()
     */
    private $tickets;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User")
     * @ORM\JoinColumn(nullable=false)
     * @JMS\Groups({"get_project"})
     * @JMS\Expose()
     */
    private $creator;


    public function __construct()
    {
        $this->users = new ArrayCollection();
        $this->tickets = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return Collection|User[]
     */
    public function getUsers(): Collection
    {
        return $this->users;
    }

    public function addUser(User $user): self
    {
        if (!$this->users->contains($user)) {
            $this->users[] = $user;
        }

        return $this;
    }

    public function removeUser(User $user): self
    {
        if ($this->users->contains($user)) {
            $this->users->removeElement($user);
        }

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    /**
     * @return Collection|Ticket[]
     */
    public function getTickets(): Collection
    {
        return $this->tickets;
    }

    public function addTicket(Ticket $ticket): self
    {
        if (!$this->tickets->contains($ticket)) {
            $this->tickets[] = $ticket;
            $ticket->setProject($this);
        }

        return $this;
    }

    public function removeTicket(Ticket $ticket): self
    {
        if ($this->tickets->contains($ticket)) {
            $this->tickets->removeElement($ticket);
            // set the owning side to null (unless already changed)
            if ($ticket->getProject() === $this) {
                $ticket->setProject(null);
            }
        }

        return $this;
    }

    public function setCreationDate($creationDate)
    {
        $this->creationDate = $creationDate;

        return $this;
    }

    public function setModificationDate($modificationDate)
    {
        $this->modificationDate = $modificationDate;

        return $this;
    }

    public function getCreationDate(): ?\DateTimeInterface
    {
        return $this->creationDate;
    }

    public function getModificationDate(): ?\DateTimeInterface
    {
        return $this->modificationDate;
    }

    /** @ORM\PrePersist */
    public function prePersist()
    {
        $this->setCreationDate(new \DateTime("now"))
             ->setModificationDate(new \DateTime("now"));
    }

    /** @ORM\PreUpdate */
    public function preUpdate()
    {
        $this->setModificationDate(new \DateTime("now"));
    }

    public function getCreator(): ?User
    {
        return $this->creator;
    }

    public function setCreator(?User $creator): self
    {
        $this->creator = $creator;

        return $this;
    }
}
