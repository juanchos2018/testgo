<?php if ( ! defined('BASEPATH')) exit('No se permite el acceso directo al script');

define ('K_PATH_IMAGES', dirname(__FILE__) . '/../../public/images/');

class Printable_report extends TCPDF {
    
    public function __construct($opts)
    {
        $orientation = isset($opts['orientation']) ? $opts['orientation'] : 'P';
        
        parent::__construct($orientation);
        
        if (isset($opts['title'])) {
            $this->SetTitle($opts['title']);
        } else {
            $this->SetTitle('Reporte');
        }
        
        $this->SetAuthor('Sistema ERP Go!');
        
        $this->SetDefaultMonospacedFont('courier');
        
        $this->SetMargins(15, 20, 15);
        
        $this->SetAutoPageBreak(TRUE, 20);
        $this->setFontSubsetting(TRUE);
        
        $this->AddPage();
        $this->SetFont('helvetica', '', 11);
        $this->setFillColor(255, 204, 0);
        
        if (isset($opts['info']) and count($opts['info']) > 0) {
            if (isset($opts['info_width']) and is_array($opts['info_width'])) {
                if (count($opts['info_width']) === 2) {
                    list($first_info_width, $second_info_width) = $opts['info_width'];
                    
                    if ($first_info_width <= 0) {
                        $first_info_width = 30;
                    }
                } elseif (count($opts['info_width']) === 1) {
                    $first_info_width = $opts['info_width'][0];
                    $second_info_width = 0;
                } else {
                    $first_info_width = 30;
                    $second_info_width = 0;
                }
            } else {
                $first_info_width = 30;
                $second_info_width = 0;
            }
            
            foreach ($opts['info'] as $key => $value) {
                $this->Cell($first_info_width, 0, $key, 1, FALSE, 'L', TRUE, '', 0, FALSE);
                $this->Cell($second_info_width, 0, $value, 1, FALSE, 'L', 0, '', 0, FALSE);
                $this->Ln();
            }
            
            $this->setY($this->getY() + 5);
        }
    }
    
    public function Header()
    {
        $this->Image(K_PATH_IMAGES . 'header.png', 15, 5, 15, 0, 'PNG', '', 'T', FALSE, 300, '', FALSE, FALSE, 0, FALSE, FALSE, FALSE);
        
        $this->SetFont('helvetica', '', 11);
        
        $this->Cell(0, 10, $this->title, 0, FALSE, 'C', 0, '', 0, FALSE, 'T', 'M');
        
        $this->SetY($this->GetY() + 11);
        $this->SetX($this->original_lMargin);
        
        $this->SetLineStyle(array('width' => 0.85 / $this->k, 'cap' => 'butt', 'join' => 'miter', 'dash' => 0, 'color' => array(127, 51, 0)));
        $this->Cell(0, 0, '', 'T', 0, 'C');
    }
    
    public function Footer()
    {
        $this->SetY(-15);
        
        $this->SetLineStyle(array('width' => 0.85 / $this->k, 'cap' => 'butt', 'join' => 'miter', 'dash' => 0, 'color' => array(127, 51, 0)));
        
        $this->SetFont('helvetica', '', 9);
        $this->Cell(40, 10, 'Página ' . $this->PageNo() . ' de ' . $this->getAliasNbPages(), 'T', 0, 'L', 0, '', 0, FALSE, 'T', 'M');
        $this->Cell(0, 10, date('d/m/Y h:iA'), 'T', 0, 'R', 0, '', 0, FALSE, 'T', 'M');
    }
    
    public function getRemainingWidth()
    {
        return parent::getRemainingWidth();
    }
    
}
